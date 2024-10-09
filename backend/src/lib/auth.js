import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

function authenticateToken(req, res, next) {
    const token = req.cookies.token; 

    // Unauthorized if no token is found
    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        // Forbidden if token is invalid
        if (err) {
            return res.sendStatus(403); 
        }

        req.user = user;
        next();
    });
}

export { 
    authenticateToken 
};
