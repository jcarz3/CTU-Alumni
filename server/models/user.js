const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    birthday: { type: String },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    profilePic: { type: String },
    middleName: { type: String },
    bio: { type: String },
    address: { type: String },
    phone: { type: String },
    gender: { type: String },
    age: { type: Number },
    course: { type: String },
    schoolYear: { type: Number },
    empStat: { type: String },

    notification: [
        {
            notificationId: { type: String },
            title: { type: String },
            description: { type: String },
            date: { type: Date, default: Date.now },
            read: { type: Boolean, default: false },
        },
    ],

    award: [
        {
            awardName: { type: String },
            issuer: { type: String },
            dateIssued: { type: String },
            description: { type: String },
        },
    ],

    experience: [{ title: String, description: String }],
    education: [{ title: String, location: String }],
    skills: [{ title: String }],
    postDate: { type: Date, default: Date.now },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "1h",
    });
    return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
    const schema = Joi.object({
        // firstName: Joi.string().required().label("First Name"),
        // lastName: Joi.string().required().label("Last Name"),
        // userId: Joi.string().required().label("User ID"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),

        // birthday: Joi.string().required().label("Birthday"),
    });
    return schema.validate(data);
};

module.exports = { User, validate };
