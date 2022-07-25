import express from "express";
import cors from "cors";
import connection from "./utils/db.js";
import usersRouter from "./routes/users.js";
import index from "./routes/index.js";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/auth", usersRouter);

app.use("/", index);

app.listen(3000, () => {
  //console.log("up and running");
});
