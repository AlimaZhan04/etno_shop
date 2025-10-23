import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import User from "./models/User.js";

const app = express();
app.use(express.json());

const run = async () => {
  await mongoose.connect(config.db.url);

  const existingUser = await User.findOne({ email: "test@example.com" });
  if (!existingUser) {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });
    console.log("✅ Test user created:", user);
  }

  app.listen(config.port, () =>
    console.log(`Server started on port ${config.port}`)
  );
};

run().catch((e) => console.log(e));
