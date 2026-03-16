import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRoutes";
import assetRoutes from "./routes/assetRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import marketRoutes from "./routes/marketRoutes";
import tradeRoutes from "./routes/tradeRoutes";

const PORT = process.env.PORT || 5000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard API",
      version: "1.0.0",
      description: "API documentation for the Finance Dashboard application",
    },
    servers: [{ url: `http://localhost:${PORT}/` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./dist/routes/*.js"],
};

export const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-url.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/rebalance", tradeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
