import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

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
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skipCount = (pageNumber - 1) * pageSize;

    const filterQuery = { isPublished: true };

    if (category) filterQuery.category = category.toLowerCase();
    if (difficulty) filterQuery.difficulty = difficulty.toLowerCase();

    if (tags) {
      const extractedTags = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      if (extractedTags.length > 0) {
        filterQuery.tags = { $all: extractedTags };
      }
    }

    if (search) {
      filterQuery.$text = { $search: search };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      popular: { averageRating: -1, totalRatings: -1 },
      cookingTime: { cookingTime: 1 },
    };
    const appliedSort = sortOptions[sort] || sortOptions.newest;

    const [totalRecipes, recipeList] = await Promise.all([
      Recipe.countDocuments(filterQuery),
      Recipe.find(filterQuery)
        .populate("author", "username profileImage")
        .sort(appliedSort)
        .skip(skipCount)
        .limit(pageSize)
        .lean(),
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

const createRecipe = async (req, res, next) => {
  try {
    const recipePayload = { ...req.body, author: req.user._id };

    const newRecipe = await Recipe.create(recipePayload);

    await newRecipe.populate("author", "username profileImage");

    res.status(201).json({ status: "success", recipe: newRecipe });
  } catch (err) {
    next(err);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const existingRecipe = await Recipe.findById(req.params.id);

    if (!existingRecipe) {
      return next(new AppError("No recipe found with that ID", 404));
    }

    const isAuthor = existingRecipe.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return next(new AppError("You are not authorised to edit this recipe", 403));
    }

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

const rateRecipe = async (req, res, next) => {
  try {
    const { rating } = req.body;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return next(new AppError("Rating must be a number between 1 and 5", 400));
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return next(new AppError("No recipe found with that ID", 404));
    }

    const newTotal = recipe.totalRatings + 1;
    const newAverage = parseFloat(
      ((recipe.averageRating * recipe.totalRatings + rating) / newTotal).toFixed(2)
    );

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { averageRating: newAverage, totalRatings: newTotal },
      { new: true }
    ).populate("author", "username profileImage");

    res.status(200).json({
      status: "success",
      message: "Rating submitted successfully",
      recipe: updatedRecipe,
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
  rateRecipe,
};
