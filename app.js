import express from "express";
import swaggerUi from "swagger-ui-express";
import UserRoutes from "./routes/user.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(express.json());

app.use("/users", UserRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;