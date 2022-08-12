import { Router } from "express";
import connection from "../../../utils/db.js";

const UploadRouter = new Router();

//upload a file
UploadRouter.post("/", (req, res) => {
  let { file, filename } = req.body;
  connection.query(
    "INSERT INTO `files` SET ?",
    { file, filename },
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      return res
        .status(200)
        .json({ message: "resource uploaded successfully" });
    }
  );
});

export default UploadRouter;
