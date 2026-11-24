import "reflect-metadata";
import http from 'node:http';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { env } from './lib/config/env.js';

async function startServer() {
  try {
    await mongoose.connect(env.db.url);
    console.log('Connected to MongoDB successfully');

    const app = createApp();
    const server = http.createServer(app);

    server.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });

    async function shutdown() {
      await mongoose.disconnect();
      server.close(() => {
        console.log('Server and database connection closed.');
        process.exit(0);
      });
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer();