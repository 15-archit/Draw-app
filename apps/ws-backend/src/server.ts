import { createWebSocketServer } from "./index";

const port = 8080;

createWebSocketServer(port);

console.log(`WebSocket server running on port ${port}`);