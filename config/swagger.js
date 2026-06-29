import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "REST API documentation for the user management service",
      contact: {
        name: "Danyal Arman",
        email: "danyalarman@gmail.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);