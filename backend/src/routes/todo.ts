import { authenticateToken } from "../middlewares/authentication";

import { validateTodo, TodoModel } from "../models/Todo";

import express from "express";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

function checkFileType(file: any, cb: any) {
  const filetypes = /jpeg|jpg|png|gif|pdf|docx|txt/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.post("/", authenticateToken, upload, async (req: any, res: any) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    const imageUrl =
      req.files && req.files.image
        ? `http://localhost:5000/uploads/${req.files.image[0].filename}`
        : null;

    const fileUrl =
      req.files && req.files.file
        ? `http://localhost:5000/uploads/${req.files.file[0].filename}`
        : null;

    const todo = new TodoModel({
      title: name,
      userId,
      imageUrl,
      fileUrl,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { search, tags, page = 1, limit = 10 } = req.query;

    const todos = await TodoModel.find({
      userId,
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ todos, page, limit });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req: any, res: any) => {
  try {
    const todo = await TodoModel.findById(req.params.id);
    if (!todo || todo.userId.toString() !== req.user.userId) {
      return res.sendStatus(403);
    }
    await todo.deleteOne();
    res.sendStatus(204);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", authenticateToken, upload, async (req: any, res: any) => {
  try {
    console.log(req.body);
    const { title, description } = req.body;
    const todo = await TodoModel.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    if (todo.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to update this todo" });
    }

    const imageUrl =
      req.files && req.files.image
        ? `http://localhost:5000/uploads/${req.files.image[0].filename}`
        : todo.imageUrl;

    const fileUrl =
      req.files && req.files.file
        ? `http://localhost:5000/uploads/${req.files.file[0].filename}`
        : todo.fileUrl;

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.imageUrl = imageUrl;
    todo.fileUrl = fileUrl;

    await todo.save();
    res.status(200).json(todo);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default { routerTodo: router };
