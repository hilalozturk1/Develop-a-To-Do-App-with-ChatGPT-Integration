declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

import multer from "multer";

import path from "path";
import { Request, Response, NextFunction } from "express";

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: "File upload error" });
    }

    const originalBody = { ...req.body };

    req.body = {
      body: {
        title: originalBody.title,
        description: originalBody.description,
        userId: req.user?.userId,
        imageUrl: (req.files as { [fieldname: string]: Express.Multer.File[] })[
          "image"
        ]?.[0]
          ? `${process.env.BASE_URL}/uploads/${
              (req.files as { [fieldname: string]: Express.Multer.File[] })[
                "image"
              ][0].filename
            }`
          : undefined,
        fileUrl: (req.files as { [fieldname: string]: Express.Multer.File[] })[
          "file"
        ]?.[0]
          ? `${process.env.BASE_URL}/uploads/${
              (req.files as { [fieldname: string]: Express.Multer.File[] })[
                "file"
              ][0].filename
            }`
          : undefined,
      },
    };

    next();
  });
};
