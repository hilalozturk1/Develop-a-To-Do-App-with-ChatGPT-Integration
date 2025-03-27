import { Schema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({ error: error.errors });
    }
  };
};