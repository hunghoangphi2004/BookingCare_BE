const express = require("express");
const app = express();
const http = require("http");
require("dotenv").config();
const database = require("./config/database");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const openapiSpecification = require("./swagger");
const cors = require("cors");
const errorHandler = require("./middlewares/error.middleware");
const { Server } = require("socket.io");
const server = http.createServer(app);
const socketAuth = require("./middlewares/socketAuth.middleware");
const Room = require("./models/room.model");
const Message = require("./models/message.model");

const port = process.env.PORT || 3000;

//connect socket
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(socketAuth);

const onlineUsers = new Map();

// Lắng nghe kết nối socket
io.on("connection", (socket) => {
  const userId = socket.user.id;
  onlineUsers.set(userId, socket.id);
  console.log("⚡ User connected:", socket.user);

  // Bắt đầu phòng chat giữa 2 người
  socket.on("start_room", async (receiverId, callback) => {
    try {
      const senderId = socket.user.id;

      // Tìm phòng có 2 user này
      let room = await Room.findOne({
        members: { $all: [senderId, receiverId], $size: 2 },
      });

      if (!room) {
        room = await Room.create({ members: [senderId, receiverId] });
      }

      // Join socket vào room
      socket.join(room._id.toString());

      // Nếu receiver đang online, join receiver vào room và thông báo
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.sockets.sockets.get(receiverSocketId)?.join(room._id.toString());
        io.to(receiverSocketId).emit("joined_room", {
          roomId: room._id,
          from: socket.user.email,
        });
      }

      callback({ roomId: room._id });
    } catch (err) {
      console.error("❌ start_room error:", err);
      callback({ error: "Không thể tạo phòng" });
    }
  });

  // Gửi tin nhắn trong room
  socket.on("send_message", async ({ roomId, content }) => {
    try {
      const newMessage = await Message.create({
        roomId,
        sender: socket.user.id,
        content,
      });

      // thông báo cho user trong room
      io.to(roomId).emit("receive_message", {
        roomId,
        sender: socket.user.email,
        content,
        createdAt: newMessage.createdAt,
      });
    } catch (err) {
      console.error("❌ send_message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.user?.email);
  });
});

database.connect();

var viewEngine = require("./config/viewEngine");
var initWebRoutes = require("./routes/web");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

viewEngine(app);
initWebRoutes(app);

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(errorHandler);

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
