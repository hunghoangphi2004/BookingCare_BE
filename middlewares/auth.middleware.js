// // // middlewares/auth.middleware.js
// // const jwt = require("jsonwebtoken");
// // const User = require("../models/user.model");

// // const auth = async (req, res, next) => {
// //     try {
// //         const authHeader = req.headers.authorization;
        
// //         if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //             return res.status(401).json({ 
// //                 message: 'không tìm thấy token hoặc format sai. Sử dụng: Authorization: Bearer <token>' 
// //             });
// //         }

// //         const token = authHeader.split(' ')[1];
// //         const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 

// //         // 🔒 Check token còn tồn tại trong DB
// //         const user = await User.findById(decodedToken._id);
// //         if (!user) {
// //             return res.status(401).json({ message: "User không tồn tại", success: false });
// //         }

// //         const isTokenValid = user.tokens.some(t => t.token === token);
// //         if (!isTokenValid) {
// //             return res.status(401).json({ message: "Token đã bị revoke (logout)", success: false });
// //         }
        
// //         req.user = {
// //             id: decodedToken._id,
// //             email: decodedToken.email,
// //             role: decodedToken.role
// //         };
// //         req.token = token;
        
// //         next();
// //     } catch (err) {
// //         console.error('Auth error:', err.message);
// //         return res.status(401).json({ 
// //             message: 'xác thực thất bại',
// //             error: err.message 
// //         });
// //     }
// // };

// // module.exports = auth;

// // middlewares/auth.middleware.js
// const jwt = require("jsonwebtoken");
// const User = require("../models/user.model");

// const auth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Không tìm thấy token hoặc format sai. Sử dụng: Authorization: Bearer <token>",
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 

//     const user = await User.findById(decodedToken._id);
//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User không tồn tại" });
//     }

//     const isTokenValid = user.tokens.some((t) => t.token === token);
//     if (!isTokenValid) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Token đã bị revoke (logout)" });
//     }

//     req.user = {
//       id: decodedToken._id,
//       email: decodedToken.email,
//       role: decodedToken.role,
//     };
//     req.token = token;

//     next();
//   } catch (err) {
//     console.error("Auth error:", err.message);

//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "TokenExpired", 
//       });
//     }

//     return res.status(401).json({
//       success: false,
//       message: "TokenInvalid",
//       error: err.message,
//     });
//   }
// };

// module.exports = auth;
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message:
          "NoToken",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "UserNotFound",
      });
    }

    req.user = {
      id: decodedToken._id,
      email: decodedToken.email,
      role: decodedToken.role,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "TokenExpired" });
    }
    return res.status(401).json({ success: false, message: "TokenInvalid" });
  }
};

module.exports = auth;
