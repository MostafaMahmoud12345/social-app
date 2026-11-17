"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_js_1 = require("./app.js");
const env_js_1 = require("./lib/config/env.js");
async function startServer() {
    try {
        await mongoose_1.default.connect(env_js_1.env.db.url);
        console.log('Connected to MongoDB successfully');
        const app = (0, app_js_1.createApp)();
        const server = node_http_1.default.createServer(app);
        server.listen(env_js_1.env.port, () => {
            console.log(`Server is running on port ${env_js_1.env.port}`);
        });
        async function shutdown() {
            await mongoose_1.default.disconnect();
            server.close(() => {
                console.log('Server and database connection closed.');
                process.exit(0);
            });
        }
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}
startServer();
