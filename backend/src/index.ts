import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/messageRoutes";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(8080, () => {
  console.log("Port running in 8080");
});
