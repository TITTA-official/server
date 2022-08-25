import "dotenv/config";
import jwt from "jsonwebtoken";
import connection from "../utils/db.js";

const secretKey = process.env.SECRET_KEY;

const tokenValidator = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "unauthorized" });
  const token = authorization.split(" ")[1];

  try {
    const verification = jwt.verify(token, secretKey);
    if (verification) {
      let { id } = verification;
      connection.query(
        "SELECT * FROM `users` WHERE `id` = ?",
        [id],
        (error, results) => {
          if (error) return res.status(500).json({ error: error });
          let { username, id, type, email } = results[0];
          req.user = { username, id, type, email };
          next();
        }
      );
    }
  } catch (err) {
    // err
    if (err) return res.status(401).json({ error: "token is not valid" });
  }
};

export default tokenValidator;
