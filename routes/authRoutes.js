import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(protectRoute);

router.get("/me", getMe);
router.patch("/update-profile", updateProfile);
router.patch("/change-password", changePassword);

export default router;
