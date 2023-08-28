const mongoose = require("mongoose");

const jobDetailsSchema = new mongoose.Schema({
    ownerId: { type: String },
    title: { type: String },
    companyName: { type: String },
    companyAddress: { type: String },
    companyId: { type: String },
});
const JobDetails = mongoose.model("jobdetails", jobDetailsSchema);

module.exports = { JobDetails };
