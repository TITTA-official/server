import { Router } from "express";
import tokenValidator from "../middleware/tokenValidator.js";
import connection from "../utils/db.js";

const index = new Router();

index.get("/", (req, res) => {
  res.json({
    msg: "hello",
  });
});

//redirect user with token
index.get("/authenticate", tokenValidator, (req, res) => {
  let user = req.user;
  if (!user) return res.status(200).json({ error: "token is required" });
  return res.status(200).json({ user });
});

//get all users
index.get("/users", tokenValidator, (req, res) => {
  const { type } = req.user;
  connection.query(
    "SELECT ??, ??, ??, ??, ?? FROM `users` WHERE `type` != ?" +
      `${type === "admin" ? "AND `type` != 'superadmin'" : ""}`,
    ["username", "email", "type", "id", "score", type],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({ results });
    }
  );
});

//update user's role(type)
index.patch("/users/change_role/:id", tokenValidator, (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID required" });
  }
  connection.query(
    "UPDATE `users` SET `type` = ? WHERE `id` = ?",
    [type, id],
    (error, results) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "User's role changed successfully",
      });
    }
  );
});

//update user's score
index.patch("/users/upadate_score/:id", tokenValidator, (req, res) => {
  const { id } = req.params;
  const { score } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID required" });
  }
  connection.query(
    "UPDATE `users` SET `score` = ? WHERE `id` = ?",
    [score, id],
    (error, results) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "Score updated successfully",
      });
    }
  );
});

index.delete("/users/delete/:id", tokenValidator, (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID required" });
  }
  connection.query(
    "DELETE FROM `users` WHERE `id` = ?",
    [id],
    (error, results) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  );
});

export default index;
