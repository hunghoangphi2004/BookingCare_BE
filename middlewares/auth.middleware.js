// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'không tìm thấy token hoặc format sai. Sử dụng: Authorization: Bearer <token>' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
        
        req.user = {
            id: decodedToken._id,
            email: decodedToken.email,
            role: decodedToken.role
        };
        
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(401).json({ 
            message: 'xác thực thất bại',
            error: err.message 
        });
    }
};

module.exports = auth;