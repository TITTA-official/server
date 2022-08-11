import { Router } from "express";
import connection from "../../../utils/db.js";

const ResourcesRouter = new Router();

//get learning resource
ResourcesRouter.get("/all", (req, res) => {
  connection.query(
    "SELECT ??, ??, ?? FROM `files` ",
    ["fileID", "name", "filename"],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      // results = results.map((result) => {
      //   console.log(result.file);
      //   let file = result.file.toString();
      //   return { fileID: result.fileID, file };
      // });
      return res.status(200).json({ results });
    }
  );
});

ResourcesRouter.get("/:filename", (req, res) => {
  const { filename } = req.params;

  if (filename) {
    //change path to your local path
    res.download(`C:/Users/DevBraD/Documents/Server/uploads/${filename}`);
  }
});

export default ResourcesRouter;
