import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { log } from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", authRoutes);

app.use(errorHandler);

app.get("/", (_, res) => res.send("Auth Service Running"));

export default app;
