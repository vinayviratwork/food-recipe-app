import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const protectRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication token is missing or malformed", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const activeUser = await User.findById(decoded.userId).select("-password");

    if (!activeUser) {
      return next(new AppError("The account linked to this token no longer exists", 401));
    }

    req.user = activeUser;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Session expired — please log in again", 401));
    }
    return next(new AppError("Invalid authentication token", 401));
  }
};

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export { protectRoute, restrictTo };
