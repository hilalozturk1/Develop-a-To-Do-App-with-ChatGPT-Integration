import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/auth";
import routerTodo from "./routes/todo";
import path from "path";

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", router);
app.use("/api/todos", routerTodo.routerTodo);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Node.js + TypeScript API!");
});

export default app;
