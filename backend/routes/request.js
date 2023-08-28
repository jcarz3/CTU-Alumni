const express = require("express");
const router = express.Router();
const { Request } = require("../models/requestid");
const { User } = require("../models/user");
const nodemailer = require("nodemailer"); // para send Email

router.post("/addRequest", async (req, res) => {
    try {
        await new Request({
            email: req.body.email,
            ownerId: req.body.ownerId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })
            .save()
            .then(() => {
                console.log("success ang id request");
            });
    } catch (error) {
        console.error(error);
    }
});

//ara update sa date nga gi aprove ang request
router.put("/updateDate/:id", async (req, res) => {
    const email = req.body.email;
    try {
        var transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: "587",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // "Monday, January 1, 2021"
        const date = new Date(req.body.approvedDate);
        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const mailOptions = {
            from: {
                name: "CTU Alumni Information System",
                address: process.env.USER,
            }, // sender address
            to: req.body.email, // list of receivers
            subject: "Alumni Id Request Accepted", // Subject line
            text: "Hello",
            html: `
            <div style="padding:30px;border-style: ridge; background-color: #212429; height:100% ">
            <p style="color: #BFBFBF; font-size: 19px">Dear ${req.body.firstName} ${req.body.lastName}</p>
            <p style="color: #BFBFBF; font-size: 17px">Your request for an alumni ID has been approved!</p>
            <ul>
                <li style="color: #FFFFFF; font-size: 15px">From: Cebu Technological University Alumni Information System</li>
                <li style="color: #FFFFFF; font-size: 15px" >We are happy to inform you that your request for an alumni ID has been approved and will be processed. </li>
                <li style="color: #FFFFFF; font-size: 15px">Please come to the alumni office at the following date to process your ID on ${formattedDate}.</li>
            </ul>
            <p style="color: #BFBFBF; font-size: 15px">We look forward to seeing you!</p>
            <p style="color: #BFBFBF; font-size: 15px">Best regards,</p>
            <p style="color: #BFBFBF; font-size: 15px">The CTU Alumni Team</p>
            </div>
            `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("errors");
            } else {
                console.log("Email successfully sent");
            }
        });

        // para update sa date nga na apporved
        await Request.updateOne(
            { _id: req.params.id },

            {
                $set: { approvedDate: req.body.approvedDate, accept: true },
            }
        ).then(() => {
            console.log("success");
        });
    } catch (err) {
        console.log("Error " + err);
    }
});

//para update og claim or unclaimed
router.put("/claimId/:id", async (req, res) => {
    try {
        const currentDate = new Date();
        // para update sa date nga na apporved
        await Request.updateOne(
            { _id: req.params.id },

            {
                $set: { claimDate: currentDate, claimId: true },
            }
        ).then(() => {
            console.log("success");
        });

        ownerId = await Request.findById({ _id: req.params.id });
        console.log("ownerId: " + ownerId._id);
        await User.updateOne({ _id: ownerId._id }, { $set: { claimId: true } });
    } catch (err) {
        console.log("errors");
    }
});

// get all data request
router.get("/all", async (req, res) => {
    Request.find()
        .then((request) => {
            res.json(request);
        })
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

//delete Request
router.delete("/deleteRequest/:id", async (req, res) => {
    const id = req.params.id;
    await Request.findByIdAndRemove(id).exec();

    res.send("item deleted");
});

module.exports = router;
