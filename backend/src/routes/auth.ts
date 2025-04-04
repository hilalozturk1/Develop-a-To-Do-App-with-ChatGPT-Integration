import { validateUser, UserModel } from "../models/User";

import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/register", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    const userData = validateUser({ username, password });

    if (userData.error) {
      return res.status(400).json({ message: "Validation error" });
    }

    const user = new UserModel({
      username: userData.data.username,
      password: userData.data.password,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;
    const userData = validateUser({ username, password });

    if (userData.error) {
      return res.status(400).json({ message: "Validation error" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "it could not find this user." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "5d",
    });

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
