import { SocketManager } from './socketManager.js';

export function initializeSocket(server, config) {
    return new SocketManager(server, config);
}