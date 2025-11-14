const express = require('express')
const app = express()
require('dotenv').config()
const database = require('./config/database')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express')
const openapiSpecification = require('./swagger')
const cors = require('cors')
const errorHandler = require("./middlewares/error.middleware")
const route = require('./routes/client/index.route.js')
const adminRoute = require('./routes/admin/index.route.js')
const port = process.env.PORT || 3000

database.connect()

// Danh sách origin được phép
const allowedOrigins = [
  "http://localhost:3006", // local dev
  "https://booking-care-fe-8k8u.vercel.app",
  "https://booking-care-fe-8k8u-git-main-hungs-projects-88cb76d9.vercel.app",
  "https://booking-care-fe-8k8u-8atzjrhua-hungs-projects-88cb76d9.vercel.app",
  "https://bookingcare-be-eh6u.onrender.com" // nếu cần
]

// CORS middleware chuẩn
app.use(cors({
  origin: function (origin, callback) {
    console.log("Request origin:", origin)
    // Cho phép request không có origin (Postman, server-side)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true, // <--- quan trọng để gửi cookie
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

// Gán view engine
const viewEngine = require('./config/viewEngine')
viewEngine(app)

// Các route
route(app)
adminRoute(app)

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

// Xử lý lỗi
app.use(errorHandler)

// Khởi chạy server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
