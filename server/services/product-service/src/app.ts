import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { log } from "./utils/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.use(errorHandler);

app.get("/", (_, res) => res.send("Product Service Running"));

export default app;
