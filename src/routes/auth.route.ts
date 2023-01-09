import AuthController from "@/controllers/auth.controller";
import express from "express";

const router = express.Router();

const { login } = AuthController;

router.post("/login", login);

export default router;
