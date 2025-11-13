const express = require('express')
const app = express()
require('dotenv').config()
const database = require('./config/database')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const openapiSpecification = require('./swagger');
const cors = require('cors')
const errorHandler = require("./middlewares/error.middleware")
const route = require('./routes/client/index.route.js')
const adminRoute = require('./routes/admin/index.route.js')
const port = process.env.PORT || 3000

database.connect()
app.use(cors({
  origin: "http://localhost:3006", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

var viewEngine = require('./config/viewEngine')


viewEngine(app)
route(app)
adminRoute(app)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
