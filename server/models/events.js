const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    ownerId: { type: String },
    ownerName: { type: String },
    ownerPhoto: { type: String },
    accept: { type: Boolean, default: false },
    title: { type: String },
    postDate: { type: String },
    where: { type: String },
    category: { type: String },
    description: { type: String },
    eventPic: { type: String },
    course: { type: String },
    year: { type: Number },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

const Events = mongoose.model("events", eventSchema);
module.exports = { Events };
