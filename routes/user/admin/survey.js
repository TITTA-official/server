import { Router } from "express";
import connection from "../../../utils/db.js";

const SurveyRouter = new Router();

//get survey
SurveyRouter.get("/", (req, res) => {
  connection.query("SELECT * FROM `survey`", (error, results, fields) => {
    if (error) return res.status(500).json({ error: error });
    return res.status(200).json({ results });
  });
});

//get question by id
SurveyRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM `survey` where `questionID` = ?",
    [id],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({ results });
    }
  );
});

//post new question
SurveyRouter.post("/post_question", (req, res) => {
  const { data } = req.body;
  connection.query(
    "INSERT INTO `survey` SET ?",
    {
      ...data,
    },
    (error) => {
      // console.log(error);
      if (!error) {
        return res.status(201).json({
          message: "Question uploaded successfully",
        });
      }
      return res.status(500).json({ error: "internal server error" });
    }
  );
});

//update question with id
SurveyRouter.patch("/update_question/:id", (req, res) => {
  const { id } = req.params;
  const { question } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Question ID required" });
  }
  connection.query(
    "UPDATE `survey` SET `question` = ? WHERE `questionID` = ?",
    [question, id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "Question updated successfully",
      });
    }
  );
});

//update options
SurveyRouter.patch("/update_options/:id", (req, res) => {
  const { id } = req.params;
  const { always, never, sometimes, rarely } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Question ID required" });
  }
  connection.query(
    "UPDATE `survey` SET `always` = ?, `never` = ?, `rarely` = ?, `sometimes` = ? WHERE `questionID` = ?",
    [always, never, sometimes, rarely, id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "options updated successfully",
      });
    }
  );
});

SurveyRouter.delete("/delete_question/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Question ID required" });
  }
  connection.query(
    "DELETE FROM `survey` WHERE `questionID` = ?",
    [id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "Question deleted successfully",
      });
    }
  );
});

export default SurveyRouter;
