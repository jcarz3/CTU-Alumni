const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        //pangitaon ang email sa database
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res
                .status(401)
                .send({ message: "Invalid Email or Password" });

        // i dcyrpt sa ang password gikan mongodb nya i compare sa  gi input na password if sakto ba
        // const validPassword = await bcrypt.compare(
        //     req.body.password,
        //     user.password
        // );

        // // para invalid password
        // if (!validPassword)
        //     return res
        //         .status(401)
        //         .send({ message: "Invalid Email or Password" });

        // if notActive dili ka log in
        if (!user.isActive)
            return res
                .status(401)
                .send({ message: "Your Account is not active." });

        //const token = user.generateAuthToken();
        const token = user._id;
        res.status(200).send({
            data: token,
            message: "logged in successfully",
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//validate : para required sa input if dili inputag value
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;
