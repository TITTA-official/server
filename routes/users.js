import { Router } from "express";
import { loginValidator, registerValidator } from "../utils/validate.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../utils/db.js";
import "dotenv/config";

const secretKey = process.env.SECRET_KEY;

const usersRouter = new Router();

usersRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await loginValidator(email, password);
  if (result.details) {
    return res.status(200).json({ error: result.details });
  }

  connection.query(
    "SELECT * FROM `users` WHERE `email` = ?",
    [result.email],
    async (error, results) => {
      if (error) {
        return res.status(200).json({ registration: "failed" });
      }
      if (results.length > 0) {
        let hash = results[0]?.password;
        let check = await bcrypt.compare(result.password, hash);

        if (!check) {
          return res.status(200).json({ success: false });
        }
        let token = jwt.sign(result, secretKey, { expiresIn: 60 * 60 * 24 });
        return res.status(200).json({
          success: true,
          token,
          user: {
            username: results[0]?.username,
            email: results[0]?.email,
            type: results[0].type,
          },
        });
      }
      return res.status(200).json({ error: "user not found" });
    }
  );
});

usersRouter.post("/register", async (req, res) => {
  const { email, password, username, type, confPassword } = req.body;

  const result = await registerValidator(
    email,
    password,
    username,
    type,
    confPassword
  );
  if (result.details) {
    return res.status(200).json({ error: result.details[0].message });
  }

  connection.query(
    "SELECT * FROM `users` WHERE `email` = ?",
    [result.email],
    (error, results, fields) => {
      if (error) {
        return res.status(200).json({ registration: "failed" });
      }
      if (results.length > 0) {
        return res.status(200).json({ msg: "user exist" });
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err)
          return res.status(500).json({ error: "internal server error" });
        bcrypt.hash(result.password, salt, (err, hash) => {
          if (err)
            return res.status(500).json({ error: "internal server error" });
          //console.log(hash);
          connection.query(
            "INSERT INTO `users` SET ?",
            { username, email, password: hash, type },
            (error, results, fields) => {
              //console.log(error);
              if (!error) {
                let token = jwt.sign(result, secretKey, {
                  expiresIn: 60 * 60 * 24,
                });
                return res
                  .status(201)
                  .json({
                    registration: "successfull",
                    token,
                    user: { username, email, type },
                  });
              }
              return res.status(500).json({ error: "internal server error" });
            }
          );
        });
      });
    }
  );
});

export default usersRouter;
