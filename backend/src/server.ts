import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./index";

const port = process.env.PORT || 5000;

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
    });
    console.log("database connection successfully");
  } catch (error: unknown) {
    console.log(`failed to connect database ${error}`);
  }
}

main();
