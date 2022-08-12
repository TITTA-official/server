import { Router } from "express";
import connection from "../../../utils/db.js";

const ResourcesRouter = new Router();

//get learning resource
ResourcesRouter.get("/all", (req, res) => {
  connection.query(
    "SELECT ??, ??, ?? FROM `files` ",
    ["fileID", "file", "filename"],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({ results });
    }
  );
});

//delete a file
ResourcesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "file ID required" });
  }
  connection.query("DELETE FROM `files` WHERE `fileID` = ?", [id], (error) => {
    if (error) return res.status(500).json({ error: error });
    return res.status(200).json({
      success: true,
      message: "resource deleted successfully",
    });
  });
});

export default ResourcesRouter;
