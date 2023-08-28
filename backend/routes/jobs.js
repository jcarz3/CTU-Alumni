const express = require("express");
const router = express.Router();

//import ang model
const { Jobs } = require("../models/jobs");
const { User } = require("../models/user");
const { Events } = require("../models/events");
const { Request } = require("../models/requestid");
const { ObjectId } = require("mongodb");

const multer = require("multer");
// desk storage para image upload
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./companyLogo/");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

//request get all jobs
router.get("/", (req, res) => {
    Jobs.find()
        .then((article) => {
            res.json(article);
        })
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

// get all accepted jobs post
router.get("/all", async (req, res) => {
    Jobs.find({ accept: true }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

// get all raw jobs from users post
router.get("/allRaw", async (req, res) => {
    Jobs.find({ accept: false }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});
//count all raw jobs
router.get("/countRawJob", async (req, res) => {
    // Count the number of jobs with accept set to false
    const numJobs = await Jobs.countDocuments({ accept: false });

    // Return the count in the response
    res.json({ numJobs });
});

//get single Job
router.get("/job/:id", async (req, res) => {
    const job = await Jobs.findById(req.params.id);

    if (job) {
        res.json(job);
    } else {
        res.status(404);
    }
});

// add job post
router.post("/add", upload.single("companyLogo"), async (req, res, next) => {
    const companyLogo = req.file ? req.file.originalname : "N/A";

    const objectId = ObjectId(req.body.ownerId);
    const owner = await User.findOne({ _id: objectId });

    if (owner.isAdmin) {
        try {
            await new Jobs({
                ownerId: req.body.ownerId,
                ownerName: req.body.ownerName,
                ownerPhoto: req.body.ownerPhoto,
                title: req.body.title,
                companyName: req.body.companyName,
                location: req.body.location,
                entryLevel: req.body.entryLevel,
                description: req.body.description,
                companyLogo: companyLogo,
                accept: true,
            })
                .save()
                .then(() => {
                    console.log("success");
                });
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            await new Jobs({
                ownerId: req.body.ownerId,
                ownerName: req.body.ownerName,
                ownerPhoto: req.body.ownerPhoto,
                title: req.body.title,
                companyName: req.body.companyName,
                location: req.body.location,
                entryLevel: req.body.entryLevel,
                description: req.body.description,
                companyLogo: companyLogo,
            })
                .save()
                .then(() => {
                    console.log("success");
                });
        } catch (err) {
            console.log(err);
        }
    }
});

//find and accept job , make accept property to true
router.put("/acceptJob", async (req, res) => {
    const id = req.body.id;

    try {
        await Jobs.updateOne(
            { _id: id },
            {
                $set: {
                    accept: true,
                },
            }
        ).then(() => {
            console.log("success", id);
        });
    } catch (err) {
        console.log("Error " + err);
    }

    res.send("Updated");
});

//find and update single job
router.put("/updateJob", async (req, res) => {
    const id = req.body.id;

    const newTitle = req.body.newTitle;
    const newCompanyName = req.body.newCompanyName;
    const newLocation = req.body.newLocation;
    const newEntryLevel = req.body.newEntryLevel;
    const newDescription = req.body.newDescription;

    try {
        await Jobs.updateOne(
            { _id: id },
            {
                $set: {
                    title: newTitle,
                    companyName: newCompanyName,
                    location: newLocation,
                    entryLevel: newEntryLevel,
                    description: newDescription,
                    postDate: Date.now(),
                },
            }
        );
    } catch (err) {
        console.log("Error " + err);
    }

    res.send("Updated");
});

//find and update companyLogo of a single job
router.put("/updateJobLogo", upload.single("companyLogo"), async (req, res) => {
    const id = req.body.id;
    const newFileName = req.file.originalname;

    try {
        await Jobs.updateOne(
            { _id: id },
            {
                $set: {
                    companyLogo: newFileName,
                    postDate: Date.now(),
                },
            }
        );
    } catch (err) {
        console.log("Error " + err);
    }

    res.send("Updated");
});

//delete Job
router.delete("/deleteJob/:id", async (req, res) => {
    const id = req.params.id;
    await Jobs.findByIdAndRemove(id).exec();

    res.send("item deleted");
    console.log("na delete ng job");
});

router.get("/getCount", async (req, res) => {
    const eventCount = await Events.countDocuments({ accept: true });
    const jobCount = await Jobs.countDocuments({ accept: true });
    const idRequestCount = await Request.countDocuments();
    res.json({ eventCount, jobCount, idRequestCount });
});

module.exports = router;
