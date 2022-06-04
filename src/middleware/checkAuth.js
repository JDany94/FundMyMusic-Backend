import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECURE_KEY);
      req.user = await UserModel.findById(decoded.user.id).select(
        "-password -confirmed -token -createdAt -updatedAt -__v"
      );
      return next();
    } catch (error) {
      res.status(404).json({ msg: "Error" });
    }
  }
  if (!token) {
    const error = new Error("Token inválido");
    return res.status(401).json({ msg: error.message });
  }
  next();
};

export default auth;
