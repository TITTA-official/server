import jwt from "jsonwebtoken";
import "dotenv/config";

const secretKey = process.env.SECRET_KEY;

const tokenValidator = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "unauthorized" });
  const token = authorization.split(" ")[1];

  try {
    const verification = jwt.verify(token, secretKey);
    if (verification) {
      next();
    }
  } catch (err) {
    // err
    if (err) return res.status(401).json({ error: "token is not valid" });
  }
};

export default tokenValidator;
