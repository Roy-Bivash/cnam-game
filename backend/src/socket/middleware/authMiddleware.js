import jwt from 'jsonwebtoken';
import { config } from "../../config/config.js";

export function authenticateSocketToken(socket, next) {
    const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1];
    
    if (!token) {
        return next(new Error("Unauthorized: No token provided"));
    }

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) {
            return next(new Error("Forbidden: Invalid token"));
        }
        
        socket.user = user;
        next();
    });
}
