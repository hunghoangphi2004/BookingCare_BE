const express = require('express')
const app = express()
require('dotenv').config()
const database = require('./config/database')
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const openapiSpecification = require('./swagger');




const port = process.env.PORT || 3000

database.connect()


var viewEngine = require('./config/viewEngine')
var initWebRoutes = require('./routes/web')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app)
initWebRoutes(app)

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.get('/', (req, res) => {
  res.send("BookingCare API is running");
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
