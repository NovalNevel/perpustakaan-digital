import express from "express";
import { register, login, refreshToken, logout, getUsers } from "../controllers/auth_controllers";
import {verifyToken,isAdmin} from "../middlewares/auth";

const router = express.Router();

// @ts-ignore
router.post("/register", register);
// @ts-ignore
router.post("/login", login);
// @ts-ignore
router.post("/refresh", refreshToken);
// @ts-ignore
router.post("/logout", logout);
router.get("/users", verifyToken, isAdmin, getUsers);

export default router;