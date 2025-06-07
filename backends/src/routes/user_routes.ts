import express from "express";
import { updateUser, deleteUser, getUsers, getUserById, getUserStatistics } from "../controllers/user_controllers";
import { verifyToken, isAdmin } from "../middlewares/auth";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getUsers);

router.get("/statistics", verifyToken, isAdmin, getUserStatistics);

// @ts-ignore
router.get("/:id", verifyToken, isAdmin, getUserById);

// @ts-ignore
router.put("/:id", verifyToken, isAdmin, updateUser);

// @ts-ignore
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;

