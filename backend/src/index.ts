import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import router from "./routes/auth";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api/auth", router);
app.use("/api/todos", todoRoutes);

app.use(errorHandler);

export default app;
