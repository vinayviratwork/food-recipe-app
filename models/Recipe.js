import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    unit: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const instructionStepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    ingredients: {
      type: [ingredientSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: "A recipe must have at least one ingredient",
      },
    },
    instructions: {
      type: [instructionStepSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: "A recipe must have at least one instruction step",
      },
    },
    cookingTime: {
      type: Number,
      required: [true, "Cooking time is required"],
      min: [1, "Cooking time must be at least 1 minute"],
    },
    servings: {
      type: Number,
      default: 2,
      min: [1, "Servings must be at least 1"],
    },
    difficulty: {
      type: String,
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: "Difficulty must be beginner, intermediate, or advanced",
      },
      default: "intermediate",
    },
    tags: {
      type: [String],
      set: (tagList) => tagList.map((t) => t.toLowerCase().trim()),
    },
    category: {
      type: String,
      enum: [
        "breakfast",
        "lunch",
        "dinner",
        "dessert",
        "snack",
        "beverage",
        "appetizer",
        "side dish",
      ],
      required: [true, "Recipe category is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

recipeSchema.index({ category: 1, tags: 1 });
recipeSchema.index({ title: "text", description: "text" });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ averageRating: -1 });

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
