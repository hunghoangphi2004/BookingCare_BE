const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const socketAuth = async (socket, next) => {
  try {
    // Lấy token từ handshake (auth hoặc query)
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error("Token không được cung cấp"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra user tồn tại
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return next(new Error("User không tồn tại"));
    }

    // Kiểm tra token có còn hiệu lực (chưa bị revoke)
    const isTokenValid = user.tokens.some((t) => t.token === token);
    if (!isTokenValid) {
      return next(new Error("Token đã bị revoke (logout)"));
    }

    // Gắn thông tin user vào socket
    socket.user = {
      id: decodedToken._id,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    socket.token = token;

    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Xác thực thất bại: " + err.message));
  }
};

module.exports = socketAuth;
