import express from 'express';
import cors from 'cors';
import router from './routes/userRoute';
import allRoutes from './routes';
import path from 'path';
import * as socketIo from 'socket.io';
import connectDB from './utils/db';
import { User } from '@prisma/client';
require('dotenv').config();
connectDB();

/**
 * -------------- GENERAL SETUP ----------------
 */
const app = express();
const PORT = process.env.PORT;

/**
 * CORS configuration for allowing cross-origin requests
 */

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];

const allowedHeaders = [
  'Content-Type',
  'Authorization',
  'Access-Control-Allow-Origin',
];

const options: cors.CorsOptions = {
  origin: '*',
  methods: allowedMethods,
  credentials: true,
  allowedHeaders: allowedHeaders,
};

app.use(cors(options));


/**
 * -------------- STATIC FILES ----------------
 */
// Static Files
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));


/**
 * -------------- ROUTES ----------------
 */

// Api routes
app.use(allRoutes)

// root route
app.get('/', (req, res) => {
  const nodeEnv = process.env.NODE_ENV;
  res.send(`API ready in ${nodeEnv} environment`);
});

/**
 * -------------- SERVER ----------------
 */

const server = app.listen(PORT, () => {
    console.log(`⚡️[server]: Server running on port ${PORT}`);
  })
  .on('error', (err: Error) => {
    console.log(err);
  });

/**
* -------------- SOCKET IO ----------------
*/

interface ServerToClientEvents {
  setup: (userData: User) => void;
  connected: () => void; 
  joinChat: (room: string, name: string) => void;
  messageReceived: (newMessageRecieved: { chat: any, sender: any }) => void;
}


interface ClientToServerEvents {
  setup: (userData: User) => void;
  joinChat: (room: string, name: string) => void;
  newMessage: (newMessageRecieved: { chat: any, sender: any }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}


const io = new socketIo.Server<
ClientToServerEvents,
ServerToClientEvents,
InterServerEvents,
SocketData
>(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
    // credentials: true,
  },
} );



io.on("connection", (socket: any) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData: User) => {
    try {
      socket.join(userData.id);
      socket.emit("connected");
    } catch (error) {
      console.error("Error in handling 'setup' event:", error);
      socket.emit("setupError", { message: "Failed to handle 'setup' event" });
    }
  });

  socket.on("joinChat", (room: string, name: string) => {
    try {
      socket.join(room);
      console.log(`User ${name} joined Room: ${room}`);
    } catch (error: any) {
      console.error("Error in handling 'joinChat' event:", error.message);
      socket.emit("joinChatError", { message: "Failed to join chat room" });
    }
  });

  socket.on("newMessage", (newMessageRecieved: { chat: any, sender: any }) => {
    try {
      var chat = newMessageRecieved.chat;

      if (!chat.users) {
        console.log("chat.users not defined");
        return;
      }

      chat.users.forEach((user : User) => {
        if (user.id == newMessageRecieved.sender.id) return;

        socket.in(user.id).emit("messageReceived", newMessageRecieved);
      });
    } catch (error:any) {
      console.error("Error in handling 'newMessage' event:", error.message);
      socket.emit("newMessageError", { message: "Failed to handle 'newMessage' event" });
    }
  });

  socket.off("setup", (userData: User) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.id);
  });
});