import jwt from "jsonwebtoken";

const generateJWT = (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  return jwt.sign(payload, process.env.SECURE_KEY, {
    expiresIn: "15d",
  });
};

export default generateJWT;
