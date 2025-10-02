const express = require('express')
const app = express()
require('dotenv').config()
const database = require('./config/database')
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const openapiSpecification = require('./swagger');
const cors = require('cors') 
const errorHandler = require("./middlewares/error.middleware")
const {OpenAI} = require("openai")



const port = process.env.PORT || 3000

database.connect()


var viewEngine = require('./config/viewEngine')
var initWebRoutes = require('./routes/web')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));


viewEngine(app)
initWebRoutes(app)


const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY
  }
)



// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
