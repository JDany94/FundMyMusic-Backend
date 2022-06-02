import jwt from "jsonwebtoken";

const auth = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, permission denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECURE_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(404).json({ msg: "Invalid Token" });
  }
};

export default auth;
