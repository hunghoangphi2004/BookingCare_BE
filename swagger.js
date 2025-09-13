const swaggerJsdoc = require('swagger-jsdoc');
const path = require("path");

const options = {
    failOnErrors: true, 
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
        components: {
            securitySchemes: {
                bearerAuth: { 
                    type: 'http', 
                    scheme: 'bearer', 
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: [], 
        }]
    },
    apis: [path.join(process.cwd(), './routes/*.js')],
};

const openapiSpecification = swaggerJsdoc(options);
module.exports = openapiSpecification;