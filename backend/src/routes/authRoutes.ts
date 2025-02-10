import express from "express";
import { getMe, login, logout, signup } from "../controllers/authController";
import protectRoute from "../middleware/protectedRoute";

const authRoutes = express.Router();

authRoutes.get("/me", protectRoute, getMe);
authRoutes.post("/login", login);
authRoutes.post("/signup", signup);
authRoutes.post("/logout", logout);

export default authRoutes;
