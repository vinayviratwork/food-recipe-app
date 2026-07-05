import jwt from "jsonwebtoken";

/**
 * Signs a short-lived access token.
 * Keeping token generation centralised means changing the algorithm
 * or adding claims (e.g., refresh token rotation) only touches one file.
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    algorithm: "HS256",
  });
};

export default generateToken;
