// backend/src/models/User.js
const mongoose = require('mongoose');
const z = require('zod');


const userSchemaZod = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model('User', userSchema);

const validateUser = (userData: object) => {
  return userSchemaZod.safeParse(userData);
};

module.exports = { User: UserModel, validateUser };