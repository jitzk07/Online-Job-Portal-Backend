import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  console.log("Cookies in request:", req.cookies); // Debugging line
  const { token } = req.cookies;

  if (!token) {
    console.error("Token is missing in cookies.");
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return next(new ErrorHandler("Invalid or Expired Token", 401));
  }
});
