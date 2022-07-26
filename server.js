import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import index from "./routes/index.js";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", usersRouter);

app.use("/api/v1/", index);

app.listen(8080, () => {
  //console.log("up and running");
});
