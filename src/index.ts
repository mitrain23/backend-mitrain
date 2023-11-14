import express from 'express';
import cors from 'cors';
import router from './routes/userRoute';
import allRoutes from './routes';
import path from 'path';
require('dotenv').config();

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

app
  .listen(PORT, () => {
    console.log(`⚡️[server]: Server running on port ${PORT}`);
  })
  .on('error', (err: Error) => {
    console.log(err);
  });
