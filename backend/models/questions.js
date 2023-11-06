const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionsSchema = new Schema({
  questions: { type: Array, default: [] }, // create question with [] default value
  answers: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  correct: { type: String },
});

const Questions = mongoose.model("Questions", questionsSchema);
module.exports = { Questions };
