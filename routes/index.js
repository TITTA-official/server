import { Router } from "express";
import connection from "../utils/db.js";
import tokenValidator from "../middleware/tokenValidator.js";

const index = new Router();

index.get("/", (req, res) => {
  res.json({
    msg: "hello",
  });
});

//get all users
index.get("/users", tokenValidator, (req, res) => {
  connection.query(
    "SELECT ??, ??, ??, ?? FROM `users` ",
    ["username", "email", "type", "id"],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({ results });
    }
  );
});

//update user's role(type)
index.patch("/users/change_role/:id", tokenValidator, (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID required" });
  }
  connection.query(
    "UPDATE `users` SET `type` = ? WHERE `id` = ?",
    ["admin", id],
    (error, results) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "User's role changed successfully",
      });
    }
  );
});

export default index;
