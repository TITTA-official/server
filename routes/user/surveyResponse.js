import { Router } from "express";
import connection from "../../../utils/db.js";

const SurveyResponseRouter = new Router();

//get response
SurveyResponseRouter.get("/", (req, res) => {
  connection.query(
    "SELECT ??, ??, ?? FROM `response` ",
    ["responseID", "response", "adminID"],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      results = results.map((data) => {
        let response = JSON.parse(data.response);
        return { ...data, response };
      });
      return res.status(200).json({ results });
    }
  );
});

//get response by id
SurveyResponseRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT ??, ??, ?? FROM `response` where `responseID` = ?",
    ["responseID", "response", "adminID", id],
    (error, results, fields) => {
      if (error) return res.status(500).json({ error: error });
      results = results.map((data) => {
        let response = JSON.parse(data.response);
        return { ...data, response };
      });
      return res.status(200).json({ results });
    }
  );
});

//post new response
SurveyResponseRouter.post("/post_response", (req, res) => {
  const { data, userID } = req.body;

  connection.query(
    "INSERT INTO `response` SET ?",
    {
      response: JSON.stringify(data),
      userID,
    },
    (error) => {
      //console.log(error);
      if (!error) {
        return res.status(201).json({
          message: "response uploaded successfully",
        });
      }
      return res.status(500).json({ error: "internal server error" });
    }
  );
});

//update response with id
SurveyResponseRouter.patch("/update_response/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  if (!id) {
    return res.status(400).json({ error: "response ID required" });
  }
  connection.query(
    "UPDATE `response` SET `response` = ? WHERE `responseID` = ?",
    [JSON.stringify(data), id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "response updated successfully",
      });
    }
  );
});

//delete response
SurveyResponseRouter.delete("/delete_response/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "response ID required" });
  }
  connection.query(
    "DELETE FROM `response` WHERE `responseID` = ?",
    [id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "response deleted successfully",
      });
    }
  );
});

export default SurveyResponseRouter;
