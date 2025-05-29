import express from "express";
import { register, login, refreshToken, logout } from "../controllers/auth_controllers";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;