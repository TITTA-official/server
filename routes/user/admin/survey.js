import { Router } from "express";
import connection from "../../../utils/db.js";

const SurveyRouter = new Router();

//get survey
SurveyRouter.get("/survey", (req, res) => {
  connection.query(
    "SELECT ??, ?? FROM `surveys` ",
    ["survey", "adminID"],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      results = results.map((result) => {
        let survey = JSON.parse(result.survey);

        return { survey, adminID: result.adminID };
      });
      return res.status(200).json({ results });
    }
  );
});

SurveyRouter.get("/survey/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT ??, ?? FROM `surveys` where `surveyID` = ?",
    ["survey", "adminID", id],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      results = results.map((result) => {
        let survey = JSON.parse(result.survey);
        return { survey, adminID: result.adminID };
      });
      return res.status(200).json({ results });
    }
  );
});

SurveyRouter.post("/post_survey", (req, res) => {
  const { survey, adminID } = req.body;

  connection.query(
    "INSERT INTO `surveys` SET ?",
    {
      survey: JSON.stringify(survey),
      adminID,
    },
    (error, results, fields) => {
      //console.log(error);
      if (!error) {
        return res.status(201).json({
          results,
        });
      }
      return res.status(500).json({ error: "internal server error" });
    }
  );
});

SurveyRouter.patch("/update_survey/:id", (req, res) => {
  const { id } = req.params;
  const { survey } = req.body;

  if (!id) {
    return res.status(400).json({ error: "survey ID required" });
  }
  connection.query(
    "UPDATE `surveys` SET `survey` = ? WHERE `surveyID` = ?",
    [JSON.stringify(survey), id],
    (error, results) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "survey updated successfully",
      });
    }
  );
});

SurveyRouter.delete("/delete_survey/:id", (req, res) => {
  const { id } = req.params;
  const { survey } = req.body;

  if (!id) {
    return res.status(400).json({ error: "survey ID required" });
  }
  connection.query(
    "DELETE FROM `surveys` WHERE `surveyID` = ?",
    [id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "survey deleted successfully",
      });
    }
  );
});

export default SurveyRouter;
