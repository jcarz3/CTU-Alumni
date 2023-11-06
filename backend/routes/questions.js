const express = require("express");
const router = express.Router();
const { Questions } = require("../models/questions");
// import questions from "../database/data.js";
// const questions = require("../database/data.js");
// const answers = require("../database/data.js");

router.get("/getQuestions", async (req, res) => {
  try {
    const q = await Questions.find();
    res.json(q);
  } catch (error) {
    res.json({ error });
  }
});

router.post("/insertQuestions", async (req, res) => {
  console.log("se");
  try {
    Questions.insertMany({ questions, answers }, function (err, data) {
      res.json({ msg: "Data Saved Successfully...!" });
    });
  } catch (error) {
    res.json({ error });
  }
});
module.exports = router;
