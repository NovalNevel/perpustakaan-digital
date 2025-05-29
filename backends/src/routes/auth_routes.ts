import express from "express";
import { register, login, refreshToken, logout } from "../controllers/auth_controllers";

const router = express.Router();

// @ts-ignore
router.post("/register", register);
// @ts-ignore
router.post("/login", login);
// @ts-ignore
router.post("/refresh", refreshToken);
// @ts-ignore
router.post("/logout", logout);

export default router;