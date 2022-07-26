import { Router } from "express";
import connection from "../utils/db.js";

const index = new Router();

index.get("/", (req, res) => {
  res.json({
    msg: "hello",
  });
});

index.get("/users", (req, res) => {
  connection.query(
    "SELECT ?? FROM `users` ",
    ["username", "email", "type"],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({ results });
    }
  );
});

export default index;
