import express from "express";
import { register, login, refreshToken, logout, getUsers } from "../controllers/auth_controllers";
import {verifyToken,isAdmin} from "../middlewares/auth";

const router = express.Router();


router.post("/register", async (req, res) => {
    await register(req, res);
});

router.post("/login", async (req, res) => {
    await login(req, res);
});

router.post("/refresh", async (req, res) => {
    await refreshToken(req, res);
});

router.post("/logout", async (req, res) => {
    await logout(req, res);
});

router.get("/users", verifyToken, isAdmin, getUsers);

export default router;