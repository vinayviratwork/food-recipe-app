import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// All routes below this point require a valid JWT
router.use(protectRoute);

router.get("/me", getMe);
router.patch("/update-profile", updateProfile);

export default router;
