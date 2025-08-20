import express from "express";
import { register, login, forgotPassword } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation, forgotPasswordValidation } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

export default router;
