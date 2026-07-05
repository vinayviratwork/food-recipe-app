import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

// ---------------------------------------------------------------------------
// GET /api/recipes
// Supports: ?page, ?limit, ?category, ?tags (comma-separated), ?difficulty,
//           ?search (full-text), ?sort (newest | popular | cookingTime)
// ---------------------------------------------------------------------------
const getRecipes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      tags,
      difficulty,
      search,
      sort = "newest",
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10))); // Cap at 50 to protect the DB
    const skipCount = (pageNumber - 1) * pageSize;

    // Build the filter object incrementally so only provided params affect the query
    const filterQuery = { isPublished: true };

    if (category) filterQuery.category = category.toLowerCase();
    if (difficulty) filterQuery.difficulty = difficulty.toLowerCase();

    // Tag filtering: accept "italian,vegetarian" and match documents containing ALL tags
    if (tags) {
      const extractedTags = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      if (extractedTags.length > 0) {
        filterQuery.tags = { $all: extractedTags };
      }
    }

    // Full-text search uses the compound text index on title + description
    if (search) {
      filterQuery.$text = { $search: search };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      popular: { averageRating: -1, totalRatings: -1 },
      cookingTime: { cookingTime: 1 },
    };
    const appliedSort = sortOptions[sort] || sortOptions.newest;

    // Run count and data fetch in parallel — avoids two sequential round-trips
    const [totalRecipes, recipeList] = await Promise.all([
      Recipe.countDocuments(filterQuery),
      Recipe.find(filterQuery)
        .populate("author", "username profileImage")
        .sort(appliedSort)
        .skip(skipCount)
        .limit(pageSize)
        .lean(), // lean() returns plain JS objects — faster for read-only payloads
    ]);

    res.status(200).json({
      status: "success",
      results: recipeList.length,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecipes / pageSize),
        totalRecipes,
        hasNextPage: pageNumber < Math.ceil(totalRecipes / pageSize),
        hasPrevPage: pageNumber > 1,
      },
      recipes: recipeList,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/recipes/:id
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      "username profileImage bio"
    );

    if (!recipe) {
      return next(new AppError("No recipe found with that ID", 404));
    }

    res.status(200).json({ status: "success", recipe });
  } catch (err) {
    next(err);
  }
};

// POST /api/recipes  (protected)
const createRecipe = async (req, res, next) => {
  try {
    const recipePayload = { ...req.body, author: req.user._id };

    const newRecipe = await Recipe.create(recipePayload);

    // Populate author info so the response mirrors what GET /recipes returns
    await newRecipe.populate("author", "username profileImage");

    res.status(201).json({ status: "success", recipe: newRecipe });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/recipes/:id  (protected — only the author or an admin may edit)
const updateRecipe = async (req, res, next) => {
  try {
    const existingRecipe = await Recipe.findById(req.params.id);

    if (!existingRecipe) {
      return next(new AppError("No recipe found with that ID", 404));
    }

    // toString() is necessary because ObjectId !== String in a strict comparison
    const isAuthor = existingRecipe.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return next(new AppError("You are not authorised to edit this recipe", 403));
    }

    // Prevent re-assigning authorship through a PATCH request
    delete req.body.author;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("author", "username profileImage");

    res.status(200).json({ status: "success", recipe: updatedRecipe });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/recipes/:id  (protected — only the author or an admin may delete)
const deleteRecipe = async (req, res, next) => {
  try {
    const existingRecipe = await Recipe.findById(req.params.id);

    if (!existingRecipe) {
      return next(new AppError("No recipe found with that ID", 404));
    }

    const isAuthor = existingRecipe.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return next(new AppError("You are not authorised to delete this recipe", 403));
    }

    await existingRecipe.deleteOne();

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
};

// POST /api/recipes/:id/save  (protected — toggle save/unsave for the current user)
const toggleSaveRecipe = async (req, res, next) => {
  try {
    const targetRecipeId = req.params.id;
    const currentUser = await User.findById(req.user._id);

    const alreadySaved = currentUser.savedRecipes.includes(targetRecipeId);

    const updateOperation = alreadySaved
      ? { $pull: { savedRecipes: targetRecipeId } }
      : { $addToSet: { savedRecipes: targetRecipeId } };

    await User.findByIdAndUpdate(req.user._id, updateOperation);

    res.status(200).json({
      status: "success",
      message: alreadySaved ? "Recipe removed from your saved list" : "Recipe saved successfully",
      saved: !alreadySaved,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/recipes/saved  (protected — returns the current user's saved recipes)
const getSavedRecipes = async (req, res, next) => {
  try {
    const userWithSaved = await User.findById(req.user._id).populate({
      path: "savedRecipes",
      populate: { path: "author", select: "username profileImage" },
    });

    res.status(200).json({
      status: "success",
      results: userWithSaved.savedRecipes.length,
      recipes: userWithSaved.savedRecipes,
    });
  } catch (err) {
    next(err);
  }
};

export {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleSaveRecipe,
  getSavedRecipes,
};
