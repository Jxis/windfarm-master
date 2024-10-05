const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { email, _id, role } = isTokenValid({ token });
    req.user = { email, _id, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
