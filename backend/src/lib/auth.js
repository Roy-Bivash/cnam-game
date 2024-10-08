import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized if no token is provided
    }

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user; // Attach the decoded user data to the request object
        next();
    });
}


export {
    authenticateToken
}