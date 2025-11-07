const express = require('express')
const app = express()
require('dotenv').config()
const database = require('./config/database')
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const openapiSpecification = require('./swagger');
const cors = require('cors') 
const errorHandler = require("./middlewares/error.middleware")



const port = process.env.PORT || 3000

database.connect()
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

var viewEngine = require('./config/viewEngine')
var initWebRoutes = require('./routes/web')


viewEngine(app)
initWebRoutes(app)





// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
