import express from "express";
import { register, login } from "../controllers/auth_controllers";

const router = express.Router();

// Route untuk register
// @ts-ignore
router.post("/register", register);
// Route untuk login
// @ts-ignore
router.post("/login", login);

export default router;