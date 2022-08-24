import { Router } from "express";

// import tokenValidator from "../../../middleware/tokenValidator.js";
import connection from "../../../utils/db.js";

const SurveyRouter = new Router();

//get survey
SurveyRouter.get("/", (req, res) => {
  connection.query("SELECT * FROM `survey`", (error, results) => {
    if (error) return res.status(500).json({ error: error });
    return res.status(200).json({ results });
  });
});

//get survey linkages
SurveyRouter.get("/linkage", (req, res) => {
  connection.query("SELECT * FROM `option_linking`", (error, results) => {
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

//get question linkage by id
SurveyRouter.get("/linkage/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM `option_linking` where `questionID` = ?",
    [id],
    (error, results) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({ results });
    }
  );
});

//post new question
SurveyRouter.post("/post_question", (req, res) => {
  const data = req.body;
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
  const data = req.body;

  if (!id) {
    return res.status(400).json({ error: "Question ID required" });
  }
  connection.query(
    "UPDATE `survey` SET ? WHERE `questionID` = ?",
    [{ ...data }, id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "Question updated successfully",
      });
    }
  );
});

//post new options linkage
SurveyRouter.post("/post_linkage", (req, res) => {
  const data = req.body;
  connection.query(
    "INSERT INTO `option_linking` SET ?",
    {
      ...data,
    },
    (error) => {
      // console.log(error);
      if (!error) {
        return res.status(201).json({
          message: "Linkage was successful",
        });
      }
      return res.status(500).json({ error: "internal server error" });
    }
  );
});

//update options linkage
SurveyRouter.patch("/update_linkage/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    return res.status(400).json({ error: "Question ID required" });
  }
  connection.query(
    "UPDATE `option_linking` SET ? WHERE `questionID` = ?",
    [{ ...data }, id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "Linkage updated successfully",
      });
    }
  );
});

SurveyRouter.delete("/delete_question/:questionID", (req, res) => {
  const { questionID } = req.params;

  if (!questionID) {
    return res.status(400).json({ error: "Question ID required" });
  }
  connection.query(
    "DELETE FROM `survey` WHERE `questionID` = ?",
    [questionID],
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
