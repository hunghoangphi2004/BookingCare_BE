const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        return res.status(401).json({
            message: "Bạn chưa đăng nhập",
            success: false
        });
    } else {
        const user = await User.findOne({ token: req.cookies.tokenUser }).select("-password")
        if (!user) {
            return res.status(401).json({
                message: "Token không hợp lệ hoặc đã hết hạn",
                success: false
            });
        } else {
            req.user = {
                id: user._id,
                email: user.email,
                role: user.role,
            };
            next()
        }
    }
};
