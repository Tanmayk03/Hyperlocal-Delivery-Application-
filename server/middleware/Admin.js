import UserModel from "../models/user.model.js"
export const admin = async (request, response, next) => {
  const permissionDeniedResponse = {
    message: "Permission denied",
    error: true,
    success: false,
  }

  try {
    const userId = request.userId;

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user || user.role !== "ADMIN") {
      return response.status(403).json(permissionDeniedResponse);
    }

    // User is admin, continue to next middleware
    next();

  } catch (error) {
    return response.status(500).json({
      ...permissionDeniedResponse,
      message: error.message || "Permission denied"
    });
  }
}
