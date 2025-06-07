import express from "express";
import { register, login, refreshToken, logout } from "../controllers/auth_controllers";

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

export default router;