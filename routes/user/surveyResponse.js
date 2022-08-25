import { Router } from "express";
import connection from "../../utils/db.js";

const SurveyResponseRouter = new Router();

//update response with id
SurveyResponseRouter.patch("/update_responseOption/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    return res.status(400).json({ error: "question ID required" });
  }
  connection.query(
    "UPDATE `survey` SET ? WHERE `questionID` = ?",
    [{ ...data }, id],
    (error) => {
      if (error) return res.status(500).json({ error: error });
      return res.status(200).json({
        success: true,
        message: "Response option updated successfully",
      });
    }
  );
});

export default SurveyResponseRouter;
