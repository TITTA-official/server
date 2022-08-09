import cors from "cors";
import "dotenv/config";
import express from "express";
import tokenValidator from "./middleware/tokenValidator.js";
import index from "./routes/index.js";
import SurveyRouter from "./routes/user/admin/survey.js";
import UploadRouter from "./routes/user/admin/upload.js";
import AuthRouter from "./routes/user/auth.js";

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/v1/auth", AuthRouter);

//for survey
app.use("/api/v1/admin", tokenValidator, SurveyRouter);

//for upload
app.use("/api/v1/admin/upload", tokenValidator, UploadRouter);

app.use("/api/v1", index);

app.listen(8080, () => {
  //console.log("up and running");
});
