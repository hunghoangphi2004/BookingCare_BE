const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        if (!req.headers.auth_token) {
            return res.status(401).json({ message: 'không tìm thấy token' })
        }

        const token = req.headers.auth_token
        const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_SECRET_KEY)
        req.userId = decodedToken._id
        next() 
    }
    catch (err) {
        return res.status(401).json({ message: 'xác thực thất bại' })
    }
}
module.exports = auth