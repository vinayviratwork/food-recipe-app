import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";

// POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, bio, profileImage } = req.body;

    // Validate required fields early to avoid a wasted bcrypt hash cycle
    if (!username || !email || !password) {
      return next(new AppError("Username, email, and password are required", 400));
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "username";
      return next(
        new AppError(`An account with that ${conflictField} already exists`, 409)
      );
    }

    // Password hashing is handled by the pre-save hook in the User model
    const newUser = await User.create({
      username,
      email,
      password,
      bio,
      profileImage,
    });

    const accessToken = generateToken(newUser._id);

    res.status(201).json({
      status: "success",
      accessToken,
      user: newUser, // toJSON() strips password and __v automatically
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    // Re-include password here — it's excluded by default via `select: false` on the schema
    const userCredentials = await User.findOne({ email }).select("+password");

    if (!userCredentials) {
      // Deliberately vague message to prevent user enumeration via timing differences
      return next(new AppError("Invalid email or password", 401));
    }

    const isPasswordCorrect = await userCredentials.comparePassword(password);

    if (!isPasswordCorrect) {
      return next(new AppError("Invalid email or password", 401));
    }

    const accessToken = generateToken(userCredentials._id);

    res.status(200).json({
      status: "success",
      accessToken,
      user: userCredentials, // toJSON() strips password before serialization
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  // req.user is already populated by the protectRoute middleware
  res.status(200).json({
    status: "success",
    user: req.user,
  });
};

// PATCH /api/auth/update-profile  (protected)
const updateProfile = async (req, res, next) => {
  try {
    // Prevent users from escalating their own role through this endpoint
    const { password, role, ...allowedUpdates } = req.body;

    if (password) {
      return next(
        new AppError(
          "This endpoint is not for password changes. Use /change-password instead.",
          400
        )
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      {
        new: true,          // Return the document after the update
        runValidators: true, // Re-run schema validators on the changed fields
      }
    );

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser, getMe, updateProfile };
