const mongoose = require("mongoose");

const idRequestSchema = new mongoose.Schema({
    email: { type: String },
    ownerId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    requestDate: { type: Date, default: Date.now },
    approvedDate: { type: String },
    accept: { type: Boolean, default: false },
    claimId: { type: Boolean, default: false },
    claimDate: { type: Date },
});

const Request = mongoose.model("request", idRequestSchema);
module.exports = { Request };
