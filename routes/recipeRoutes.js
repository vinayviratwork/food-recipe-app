import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleSaveRecipe,
  getSavedRecipes,
} from "../controllers/recipeController.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

// Public routes — no token required for browsing
router.get("/", getRecipes);
router.get("/:id", getRecipeById);

// Protected routes — valid JWT required
router.use(protectRoute);

router.post("/", createRecipe);
router.patch("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

// Saved-recipes feature
router.get("/user/saved", getSavedRecipes);
router.post("/:id/save", toggleSaveRecipe);

export default router;
