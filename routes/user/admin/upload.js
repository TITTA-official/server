import { Router } from "express";
import multer from "multer";
import connection from "../../../utils/db.js";

const UploadRouter = new Router();
const upload = multer({ dest: "uploads/" });

//upload a file
UploadRouter.post("/upload", upload.single("resource"), (req, res) => {
  const file = req.file;
  //   connection.query("", "", (error, results, fields) => {});
});

export default UploadRouter;
