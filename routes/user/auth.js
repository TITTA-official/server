import bcrypt from "bcryptjs";
import "dotenv/config";
import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  loginValidator,
  registerValidator,
} from "../../utils/authValidator.js";
import connection from "../../utils/db.js";

const secretKey = process.env.SECRET_KEY;

const AuthRouter = new Router();

AuthRouter.post("/login", async (req, res) => {
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
        return res.status(500).json({ error: error });
      }
      if (results.length > 0) {
        let hash = results[0]?.password;
        let check = await bcrypt.compare(result.password, hash);

        if (!check) {
          return res
            .status(401)
            .json({ success: false, error: "Wrong email or password" });
        }
        // console.log(results[0]);
        let token = jwt.sign({ id: results[0].id }, secretKey, {
          expiresIn: 60 * 60 * 24,
        });
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
      return res.status(404).json({ error: "user not found" });
    }
  );
});

AuthRouter.post("/register", async (req, res) => {
  const { email, password, username, confPassword } = req.body;

  const result = await registerValidator(
    email,
    password,
    username,
    confPassword
  );
  if (result.details) {
    return res.status(400).json({ error: result.details[0].message });
  }

  connection.query(
    "SELECT * FROM `users` WHERE `email` = ?",
    [result.email],
    (error, results, fields) => {
      if (error) {
        return res.status(500).json({ registration: "failed" });
      }
      if (results.length > 0) {
        return res.status(400).json({ msg: "user exist" });
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
            {
              username,
              email,
              password: hash,
              type: "user",
              score: 0,
            },
            (error, resultsX) => {
              // console.log(resultsX);
              if (!error) {
                let token = jwt.sign(
                  {
                    id: resultsX.insertId,
                  },
                  secretKey,
                  {
                    expiresIn: 60 * 60 * 24,
                  }
                );
                return res.status(201).json({
                  registration: "successfull",
                  token,
                  user: { username, email, type: "user" },
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

export default AuthRouter;
