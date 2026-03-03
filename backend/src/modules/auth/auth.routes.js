import { Router } from "express";
import { User } from "./auth.model.js";
import { registerUser } from "./auth.service.js";

const router = Router()

router.post("/test", async (req, res) => {
  const user = await User.create({
    fullName: "Test User",
    email: "test@gmail.com",
    password: "12345678"
  });
  res.json(user);
});

router.route("/register").post(registerUser)

export default router