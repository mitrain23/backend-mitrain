FROM node:16

# Set working directory
WORKDIR /app

# Copy package file
COPY package*.json ./
COPY prisma ./
COPY tsconfig.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . .

RUN npm run build

RUN npm run generate

EXPOSE 2000

CMD npm run migrate && node dist/indexjs
