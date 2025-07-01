const admin = require('../config/firebaseAdmin');

/**
 * Middleware to authenticate users using Firebase ID tokens
 * Expects the token in the Authorization header as "Bearer <token>"
 */
module.exports = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'No token provided. Please include a valid Firebase ID token in the Authorization header.' 
            });
        }

        const token = authHeader.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: 'Invalid token format. Please provide a valid Firebase ID token.' 
            });
        }

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Attach user information to the request object
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
            name: decodedToken.name,
            picture: decodedToken.picture
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ 
                message: 'Token has expired. Please log in again.' 
            });
        }
        
        if (error.code === 'auth/id-token-revoked') {
            return res.status(401).json({ 
                message: 'Token has been revoked. Please log in again.' 
            });
        }
        
        return res.status(401).json({ 
            message: 'Invalid token. Please provide a valid Firebase ID token.' 
        });
    }
}; 