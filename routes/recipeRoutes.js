import { Router } from "express";
import {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleSaveRecipe,
  getSavedRecipes,
  rateRecipe,
} from "../controllers/recipeController.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);

router.use(protectRoute);

router.post("/", createRecipe);
router.patch("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

router.get("/user/saved", getSavedRecipes);
router.post("/:id/save", toggleSaveRecipe);
router.post("/:id/rate", rateRecipe);

export default router;
