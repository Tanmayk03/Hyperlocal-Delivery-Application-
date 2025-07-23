import jwt from 'jsonwebtoken';

const auth = (request, response, next) => {
  try {
    const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return response.status(401).json({
        message: "Provide token",
        error: true,
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decode) {
      return response.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false,
      });
    }

    request.userId = decode.userId || decode.id; // match your token payload

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return response.status(401).json({
      message: error.message || "Authentication failed",
      error: true,
      success: false,
    });
  }
};

export default auth;
