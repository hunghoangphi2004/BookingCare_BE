// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.' 
            });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ 
            _id: decoded._id, 
            'tokens.token': token 
        });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ 
            error: 'Please authenticate.' 
        });
    }
};

// Middleware kiểm tra role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};

module.exports = { auth, authorizeRoles };