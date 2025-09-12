const swaggerJsdoc = require('swagger-jsdoc');
const path = require("path");

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')],
};

const openapiSpecification = swaggerJsdoc(options);
module.exports = openapiSpecification;