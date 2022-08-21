import cors from "cors";
import "dotenv/config";
import express from "express";
import tokenValidator from "./middleware/tokenValidator.js";
import index from "./routes/index.js";
import ResourcesRouter from "./routes/user/admin/resources.js";
import SurveyRouter from "./routes/user/admin/survey.js";
import UploadRouter from "./routes/user/admin/upload.js";
import UploadVideoRouter from "./routes/user/admin/uploadVideo.js";
import AuthRouter from "./routes/user/auth.js";
import SurveyResponseRouter from "./routes/user/surveyResponse.js";

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/v1/auth", AuthRouter);

//for survey
app.use("/api/v1/admin/survey", tokenValidator, SurveyRouter);
//for response
app.use("/api/v1/response", tokenValidator, SurveyResponseRouter);
//for upload
app.use("/api/v1/admin/upload", tokenValidator, UploadRouter);

//for upload video url
app.use("/api/v1/admin/uploadVideo", tokenValidator, UploadVideoRouter);

//for resource
app.use("/api/v1/resources", tokenValidator, ResourcesRouter);

//for response
app.use("/api/v1/response", tokenValidator, SurveyResponseRouter);

app.use("/api/v1", index);

app.use("*", (req, res) => {
  res.status(400).json({ error: "api route not found" });
});

app.listen(process.env.PORT || 8080, () => {
  //console.log("up and running");
});
