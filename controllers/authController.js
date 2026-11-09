import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, bio, profileImage } = req.body;

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
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const userCredentials = await User.findOne({ email }).select("+password");

    if (!userCredentials) {
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
      user: userCredentials,
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
};

const updateProfile = async (req, res, next) => {
  try {
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
        new: true,
        runValidators: true,
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

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new AppError("currentPassword and newPassword are required", 400));
    }

    if (newPassword.length < 8) {
      return next(new AppError("New password must be at least 8 characters", 400));
    }

    const user = await User.findById(req.user._id).select("+password");
    const isCorrect = await user.comparePassword(currentPassword);

    if (!isCorrect) {
      return next(new AppError("Current password is incorrect", 401));
    }

    user.password = newPassword;
    await user.save();

    const accessToken = generateToken(user._id);

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser, getMe, updateProfile, changePassword };
