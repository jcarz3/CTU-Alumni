const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

const xlsx = require("xlsx");

const nodemailer = require("nodemailer"); // para send Email

const multer = require("multer"); // para file upload
// desk storage para image upload
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

router.post("/addAlumni", async (req, res) => {
    const id = req.body.userId;

    try {
        const user = await User.findOne({ userId: id });

        if (user) {
            return res.status(409).send({
                message: "Alumni ID  already Exist!",
            });

            // res.status(409).send({ message: "Id Already exists" });
        } else {
            try {
                // const salt = await bcrypt.genSalt(Number(process.env.SALT));
                // const hashPassword = await bcrypt.hash(req.body.password, salt);

                await new User({
                    userId: req.body.userId,
                    birthday: req.body.birthday,
                    isAdmin: false,
                    isActive: false,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: "",
                    password: "",
                    middleName: "",
                    profilePic: "profile.png",
                }).save();
                res.status(201).send({ message: "User created successfully" });
                console.log("alumni ADDed successfully");
            } catch (err) {
                console.error(err);
            }
        }
    } catch (error) {
        res.status(409).send({ message: "User Id already existed" });
    }
    // const { error } = validate(req.body);
    // if (error)
    //     return res.status(400).send({ message: error.details[0].message });
    // pangitaon ang Id sa alumni na database
});

// para register
router.put("/register", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        try {
            if (user)
                return res
                    .status(409)
                    .send({ message: "User with given email already Exist!" });
        } catch (error) {
            throw new Error(error.message);
        }

        const userID = await User.findOne({
            $and: [
                {
                    userId: req.body.userId,
                    birthday: req.body.birthday,
                },
            ],
        });

        try {
            if (userID.isActive) {
                return res.status(409).send({
                    message: "Alumni Id Already taken!",
                });
            }
        } catch (error) {
            throw new Error(error.message);
            //  res.status(400).send({ message: error.message });
        }

        if (userID) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            try {
                await User.updateOne(
                    { _id: userID._id },

                    {
                        $set: {
                            // firstName: userID.firstName,
                            // lastName: userID.lastName,
                            middleName: "",
                            email: req.body.email,
                            password: hashPassword,
                            isActive: true,
                            isAdmin: false,
                            profilePic: "profile.png",
                            address: "",
                            phone: "",
                            postDate: Date.now(),
                        },
                    }
                );

                // para email sa alumni para naa siyay discount
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

                const userVerify = await User.findById(userID._id);

                const mailOptions = {
                    from: {
                        name: "CTU Alumni Information System",
                        address: process.env.USER,
                    }, // sender address
                    to: userVerify.email, // list of receivers
                    subject: "Account Active", // Subject line
                    text: "Hello",
                    html: `
                    <div style="padding:30px;border-style: ridge; background-color: #212429; height:100% ">
                    <p style="color: #BFBFBF; font-size: 19px">Dear ${userVerify.firstName} ${userVerify.lastName}</p>
                    <p style="color: #BFBFBF; font-size: 17px">Account succesfully Registered</p>
                    <ul>
                        <li style="color: #FFFFFF; font-size: 15px">From: Cebu Technological University Alumni Information System</li>
                        <li style="color: #FFFFFF; font-size: 15px">Subject: Your account to CTU AIS has been activated</li>
                        <li style="color: #FFFFFF; font-size: 15px">Message: Heres your discount Code </li>
                    </ul>
                    <div style="display:flex; height:90px; margin-left:90px; width:465px; justify-content:center; align-items:center; background-color: #17191C; "><h1 style="color: #3A9AED; font-size: 30px; margin-left:30px;">${userVerify._id}<h1></div>

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
            } catch (err) {
                console.log("Error " + err);
            }
        } else {
            return res
                .status(409)
                .send({ message: "Wala sa Database imong Alumni ID" });
        }

        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        res.status(500).send({
            message: "Alumni ID and Birthday does not match",
        });
    }
});

// get all data that is not admin and activated account
router.get("/all", async (req, res) => {
    User.find(
        { isAdmin: { $ne: true }, isActive: { $ne: false } },
        (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

// get all not activated account
router.get("/allNotActive", async (req, res) => {
    User.find({ isActive: { $ne: true } }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

// verify user using isActive
router.put("/activateAlumni", async (req, res) => {
    const id = req.body.id;

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

    const userVerify = await User.findById(id);

    const mailOptions = {
        from: {
            name: "CTU Alumni Information System",
            address: process.env.USER,
        }, // sender address
        to: userVerify.email, // list of receivers
        subject: "Account Verified", // Subject line
        text: "Hello",
        html: `
        <div style="padding:10px;border-style: ridge">
        <p>Dear ${userVerify.firstName} ${userVerify.lastName}</p>
        <p>Your Account is now Active</p>
        <ul>
            <li>From: Cebu Technological University Alumni Information System</li>
            <li>Subject: Your account to CTU AIS has been activated</li>
            <li>Message: You may now log in to the site using your chosen email and password</li>
        </ul>
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

    try {
        await User.updateOne(
            { _id: id },
            {
                $set: { isActive: true },
            }
        ).then(console.log("na accept na"));
    } catch (error) {
        console.log(error);
    }
});

//get single user
router.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not Found");
    }
});

//find and update single user
router.put("/updateUser", async (req, res) => {
    const id = req.body.id;

    const newFirstName = req.body.newfirstName;
    const newLastName = req.body.newlastName;
    const newMiddleName = req.body.newmiddleName;
    const newBio = req.body.newbio;
    const newAddress = req.body.newaddress;
    const newPhone = req.body.newphone;
    const newGender = req.body.newgender;
    const newAge = req.body.newage;
    const newCourse = req.body.newcourse;
    const newSchoolYear = req.body.newschoolYear;
    const newEmpStat = req.body.newempstat;

    try {
        await User.updateOne(
            { _id: id },
            {
                $set: {
                    firstName: newFirstName,
                    lastName: newLastName,
                    middleName: newMiddleName,
                    bio: newBio,
                    address: newAddress,
                    phone: newPhone,
                    gender: newGender,
                    age: newAge,
                    course: newCourse,
                    schoolYear: newSchoolYear,
                    empStat: newEmpStat,
                },
            }
        );
    } catch (err) {
        console.log("Error " + err);
    }

    res.send("Updated");
});

//update alumni profile pic
router.put(
    "/updateProfilePic",
    upload.single("profilePic"),
    async (req, res) => {
        const id = req.body.id;
        const pic = req.file.originalname;

        try {
            await User.updateOne(
                { _id: id },
                {
                    $set: {
                        profilePic: pic,
                    },
                }
            );
        } catch (err) {
            console.log("Error " + err);
        }
        res.send("Updated");
    }
);

//delete one User
router.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndRemove(id).exec();

    res.send("item deleted");
});

//para Count sa Employment Status
router.get("/countEmploymentStatus", async (req, res) => {
    try {
        const countData = []; //temporary array para sud sa na count
        const countEmployed = await User.find({
            empStat: "Employed",
            isActive: { $ne: false },
        }).count();
        const countUnemployed = await User.find({
            empStat: "Unemployed",
            isActive: { $ne: false },
        }).count();
        const countSelfemployed = await User.find({
            empStat: "Self-Employed",
            isActive: { $ne: false },
        }).count();
        const countUnderemployed = await User.find({
            empStat: "UnderEmployed",
            isActive: { $ne: false },
        }).count();

        const totalAlumni = await User.find({
            isActive: { $ne: false },
            isAdmin: { $ne: true },
        }).count();

        countData.push({
            employed: countEmployed,
            unEmployed: countUnemployed,
            selfEmployed: countSelfemployed,
            underemployed: countUnderemployed,
            totalAlumni: totalAlumni,
        });

        //send sa fronted
        res.status(200).send(countData);
    } catch (err) {
        console.log("Error " + err);
    }
});

//para change sa notifications  read to true
router.put("/changeRead/:id", async (req, res) => {
    const userId = req.params.id;
    // console.log("user ID ni", userId);

    const notificationId = req.body.notificationId;
    // console.log("notification id nga na click na notification", notificationId);

    const updateResult = await User.updateOne(
        {
            _id: userId,
            "notification.notificationId": req.body.notificationId,
        },
        { $set: { "notification.$.read": true } }
    );
    res.send(updateResult);
});

//para cound sa notifications nga wapa na read
router.get("/countUnReadEvents/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const count = user.notification.filter((n) => n.read === false).length;
        res.status(200).send({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//find and update for resume
router.put("/updateResume", async (req, res) => {
    const id = req.body.id;

    // experience
    const experience = req.body.experience
        .map((skill) => {
            return { title: skill.title, description: skill.description };
        })
        .filter((exp) => exp !== "");

    // education
    const education = req.body.education
        .map((skill) => {
            return { title: skill.title, location: skill.location };
        })
        .filter((edu) => edu !== "");

    // skills
    const skills = [];
    req.body.skills
        .map((skill) => {
            skills.push(skill.title);
        })
        .filter((skill) => skill !== "");
    // Filter out empty strings from the arrays

    try {
        await User.updateOne(
            { _id: id },

            {
                $set: { bio: req.body.bio },
                $push: {
                    experience: { $each: experience },
                    education: { $each: education },
                    skills: { $each: skills },
                },
            }
        );
    } catch (err) {
        console.log("Error " + err);
    }

    res.send("Updated");
});

//find and update or add honor and award
router.put("/addAward", (req, res) => {
    const newAward = {
        awardName: req.body.awardName,
        issuer: req.body.issuer,
        dateIssued: req.body.dateIssued,
        description: req.body.awardDescription,
    };
    User.updateOne(
        { _id: req.body.id },
        { $push: { award: newAward } },
        function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send("Award added successfully");
            }
        }
    );
});

//delete award
router.put("/deleteAward/:awardId", (req, res) => {
    console.log("userId", req.body.userId);
    console.log("Deleting", req.params.awardId);
    User.updateOne(
        { _id: req.body.userId },
        { $pull: { award: { _id: req.params.awardId } } },
        function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send("Award deleted successfully");
            }
        }
    );
});

//find and update or add experience
router.put("/addExperience", (req, res) => {
    const newExperience = {
        title: req.body.title,
        description: req.body.description,
    };
    User.updateOne(
        { _id: req.body.id },
        { $push: { experience: newExperience } },
        function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send("Award added successfully");
            }
        }
    );
});

//delete experience
router.put("/deleteExperience/:experienceId", (req, res) => {
    console.log("userId", req.body.userId);
    console.log("Deleting", req.params.awardId);
    User.updateOne(
        { _id: req.body.userId },
        { $pull: { experience: { _id: req.params.experienceId } } },
        function (error) {
            if (error) {
                console.log(error);
            } else {
                res.send("Award deleted successfully");
                console.log("Award deleted successfully");
            }
        }
    );
});

//find and update or add education details
router.put("/addEducation", (req, res) => {
    const newEducation = {
        title: req.body.title,
        location: req.body.location,
    };
    User.updateOne(
        { _id: req.body.id },
        { $push: { education: newEducation } },
        function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                console.log(
                    "Education added successfully",
                    req.body.title + req.body.description
                );
            }
        }
    );
});

//delete education
router.put("/deleteEducation/:educationId", (req, res) => {
    console.log("userId", req.body.userId);
    console.log("Deleting", req.params.educationId);
    User.updateOne(
        { _id: req.body.userId },
        { $pull: { education: { _id: req.params.educationId } } },
        function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send("Award deleted successfully");
            }
        }
    );
});

//find and update or add education details
router.put("/addSkills", (req, res) => {
    const newSkills = {
        title: req.body.title,
    };
    User.updateOne(
        { _id: req.body.id },
        { $push: { skills: newSkills } },
        function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log("Skills added successfully", req.body.title);
            }
        }
    );
});

//delete skills
router.put("/deleteSkills/:skillsId", (req, res) => {
    console.log("userId", req.body.userId);
    console.log("Deleting", req.params.skillsId);
    User.updateOne(
        { _id: req.body.userId },
        { $pull: { skills: { _id: req.params.skillsId } } },
        function (error) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send("Award deleted successfully");
            }
        }
    );
});

//para upload excel
const uploads = multer({ dest: "uploadss/" });

router.post("/excels", uploads.single("file"), (req, res) => {
    // Read the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Extract the users from the Excel file
    const users = [];
    for (const row of rows) {
        const user = {
            firstName: row.firstName,
            lastName: row.lastName,
            userId: row.userId,
            birthday: row.birthday,
        };
        users.push(user);
    }

    // Insert the users into the database
    User.insertMany(users, (err, result) => {
        if (err) throw err;
        console.log(
            `Inserted ${result.insertedCount} users into the collection`
        );

        res.send("File uploaded successfully");
    });
});

router.get("/usersWithAward", (req, res) => {
    User.aggregate([
        {
            $match: { award: { $exists: true, $ne: [] } },
        },
        {
            $project: {
                award: { $arrayElemAt: ["$award", 0] },
                firstName: 1,
                lastName: 1,
                _id: 1,
                profilePic: 1,
            },
        },
    ])
        .then((users) => {
            res.json(users);
        })
        .catch((err) => console.log(err));
});

// router.post("/usersWithAward", async (req, res) => {
//     const users = await User.aggregate([
//         { $match: { award: { $exists: true, $ne: [] } } },
//         {
//             $project: {
//                 _id: 0,
//                 userId: 1,
//                 birthday: 1,
//                 firstName: 1,
//                 lastName: 1,
//                 award: 1,
//             },
//         },
//     ]);

//     res.send(users);
// });
module.exports = router;
