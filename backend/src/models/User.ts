import mongoose from "mongoose";
import { z } from "zod";

export interface IUser extends Document {
  username: string;
  password: string;
}

const userSchemaZod = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
});

const userSchema: mongoose.Schema<IUser>  = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<IUser>('User', userSchema);

const validateUser = (userData: object) => {
  return userSchemaZod.safeParse(userData);
};

export { UserModel, validateUser };