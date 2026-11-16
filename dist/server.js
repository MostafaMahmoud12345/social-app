import { createApp } from "./app";
import http from 'node:http';
import { env } from "./lib/config/env";
import mongoose from "mongoose";
const app = createApp();
const server = http.createServer(app);
app.listen(env.port, () => console.log(`server is running on port ${env.port}`));
async function shutdown() {
    await mongoose.disconnect();
    server.close;
    process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
