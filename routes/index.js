import { Router } from "express";

const index = new Router();

index.get("/", (req, res) => {
  res.json({
    msg: "hello",
  });
});

export default index;
