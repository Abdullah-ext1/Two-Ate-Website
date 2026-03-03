import { Router } from "express";
import { User } from "./auth.model.js";
import { registerUser , loginUser } from "./auth.service.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

export default router