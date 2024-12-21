export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevent client-side access to cookies
    secure: process.env.NODE_ENV === "production", // Send cookies only over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-origin cookies in production
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token, // Include token in response body for flexibility
  });
};
