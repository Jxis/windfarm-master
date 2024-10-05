const jwt = require("jsonwebtoken");

const createJwtPayload = (user) => {
  return { email: user?.email, _id: user?._id, role: user?.role };
};

const createJWT = (user) => {
  const payload = createJwtPayload(user);

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createJWT,
  isTokenValid,
  createJwtPayload,
};
