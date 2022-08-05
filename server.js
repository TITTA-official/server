import express from "express";
import cors from "cors";
import AuthRouter from "./routes/user/auth.js";
import index from "./routes/index.js";
import "dotenv/config";
import SurveyRouter from "./routes/user/admin/survey.js";
import tokenValidator from "./middleware/tokenValidator.js";

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/v1/auth", AuthRouter);

//for survey
app.use("/api/v1/admin", tokenValidator, SurveyRouter);

app.use("/api/v1", index);

app.listen(8080, () => {
  //console.log("up and running");
});
