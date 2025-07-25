import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRouter from "./routes/posts.router.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

app.use(postRouter);
app.use(userRouter);


const start = async () => {
  const connectDb = await mongoose.connect(
    "mongodb+srv://devalgarg978:n9luY8N1WoHgNrLb@cluster0.xx7fais.mongodb.net/"
  );
  app.listen(9080, () => {
    console.log("server started on port 9080");
  });
};

start();