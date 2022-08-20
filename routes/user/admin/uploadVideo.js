import { Router } from "express";
import connection from "../../../utils/db.js";

const UploadVideoRouter = new Router();


UploadVideoRouter.get("/", (req, res) => {
    connection.query(
      "SELECT ??, ?? FROM `videoUrls` ",
      ["videoUrlID", "videoUrl"],
      (error, results, fields) => {
        if (error) return res.status(500).json({ error: error });
        return res.status(200).json({ results });
      }
    );
  });


//upload a videourl
UploadVideoRouter.post("/", (req, res) => {
  let { videoUrl } = req.body;
  connection.query(
    "INSERT INTO `videoUrls` SET ?",
    { videoUrl },
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      return res
        .status(200)
        .json({ message: "Video url uploaded successfully" });
    }
  );
});
// //upload a video url
// UploadRouter.post("/videoUrl", (req, res) => {
//   let { videoUrl } = req.body;
//   connection.query(
//     "INSERT INTO `files` SET ?",
//     { videoUrl },
//     (error, results, fields) => {
//       if (error) return res.status(500).json({ error: error });
//       return res
//         .status(200)
//         .json({ message: "video url uploaded successfully" });
//     }
//   );
// });

export default UploadVideoRouter;
