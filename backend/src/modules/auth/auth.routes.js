import { Router } from "express";
import { User } from "./auth.model.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { 
        registerUser, 
        loginUser,
        logout,
        refreshAccessToken,
        ChangePassword
    } from "./auth.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logout)
router.route("/refreshAccessToken").post(refreshAccessToken)
router.route("/ChangePassword").post(verifyJWT , ChangePassword)

export default router