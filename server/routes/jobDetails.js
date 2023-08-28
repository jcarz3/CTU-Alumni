const router = require("express").Router();
const { JobDetails } = require("../models/jobDetails");

const multer = require("multer"); // para file upload
// desk storage para image upload
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./companyId/");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.put("/addJobDetails", upload.single("companyId"), async (req, res) => {
    try {
        //i save sa events database ang na add na event
        const job = await new JobDetails({
            ownerId: req.body.id,
            title: req.body.jobTitle,
            companyName: req.body.companyName,
            companyAddress: req.body.companyAddress,
            companyId: req.file ? req.file.originalname : "N/A",
        });
        job.save((error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("success");
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// get jobs details of a user
router.get("/jobs/:id", async (req, res) => {
    const ownerId = req.params.id;
    const query = await JobDetails.find({ ownerId: ownerId });

    if (query) {
        res.json(query);
    } else {
        res.status(404);
        throw new Error("User not Found");
    }
});

//delete one Job Details of a user
router.delete("/deleteJob/:id", async (req, res) => {
    const id = req.params.id;
    await JobDetails.findByIdAndRemove(id).exec();

    res.send("item deleted");
    console.log("job details deleted");
});

//para kuha sa job details

module.exports = router;
