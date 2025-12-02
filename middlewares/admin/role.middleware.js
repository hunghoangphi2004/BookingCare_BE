const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Bạn chưa đăng nhập' });

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Không có quyền' });
        }
    };
};

module.exports = permit;
