import { Router } from "express";
import multer from "multer";
import path from "path";
import connection from "../../../utils/db.js";

const UploadRouter = new Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//upload a file
UploadRouter.post("/", upload.single("file"), (req, res) => {
  let { file } = req;
  let name = file.filename.split(".")[0];
  if (name) {
    if (file) {
      const { filename } = file;
      connection.query(
        "INSERT INTO `files` SET ?",
        { name, filename },
        (error, results, fields) => {
          if (error) return res.status(500).json({ error: error });
          //console.log(results);
          return res
            .status(200)
            .json({ message: "resource uploaded successfully" });
        }
      );
    }
  } else {
    return res.status(400).json({ message: "Title of file required" });
  }
});

//delete a file
UploadRouter.delete("/:id", (req, res) => {
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

UploadRouter.get("/all", (req, res) => {
  connection.query(
    "SELECT ??, ?? FROM `files` ",
    ["fileID", "filename"],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      // results = results.map((result) => {
      //   console.log(result.file);
      //   let file = result.file.toString();
      //   return { fileID: result.fileID, file };
      // });
      return res.status(200).send(results[0].file);
    }
  );
});

export default UploadRouter;
