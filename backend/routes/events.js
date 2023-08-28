const router = require("express").Router();
const { Events } = require("../models/events");
const { User } = require("../models/user");
const ObjectId = require("mongodb").ObjectId;

// events picure
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./eventPic/");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

//add event
router.post("/addEvent", upload.single("eventPic"), async (req, res) => {
    const pic = req.file ? req.file.originalname : "N/A";

    try {
        //i save sa events database ang na add na event
        const event = await new Events({
            ownerId: req.body.ownerId,
            ownerName: req.body.ownerName,
            ownerPhoto: req.body.ownerPhoto,
            title: req.body.title,
            description: req.body.description,
            eventPic: pic,
            postDate: req.body.date,
            where: req.body.where,
            category: req.body.category,
            course: req.body.course,
            year: req.body.year,
        });
        event.save((error) => {
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

//find and accept job , make accept property to true
router.put("/acceptEvent", async (req, res) => {
    const id = req.body.id;

    try {
        await Events.updateOne(
            { _id: id },
            {
                $set: {
                    accept: true,
                },
            }
        ).then(() => {
            console.log("success", id);
        });

        const eventdetails = await Events.findById({ _id: id });
        console.log(eventdetails);
        // notification array
        const notification = [].concat(eventdetails).map((notif) => {
            return {
                notificationId: eventdetails._id,
                title: eventdetails.title,
                description: eventdetails.description,
            };
        });
        // ibutang sa notofication property
        if (eventdetails.category === "Reunion") {
            // para sa mga alumni nga apil sa events
            console.log("succes ang event details");
            await User.updateMany(
                {
                    $and: [
                        {
                            course: eventdetails.course,
                            schoolYear: eventdetails.year,
                        },
                    ],
                },
                // { $addToSet: { notification: event._id } }
                {
                    $push: {
                        notification: { $each: notification },
                    },
                }
            );

            // para admin
            await User.findOneAndUpdate(
                {
                    isAdmin: true,
                },
                {
                    $push: {
                        notification: { $each: notification },
                    },
                }
                // { $addToSet: { notification: event._id } }
            );
        } else {
            await User.updateMany(
                {
                    isActive: true,
                },
                {
                    $push: {
                        notification: { $each: notification },
                    },
                }
                // { $addToSet: { notification: event._id } }
            );
        }
    } catch (err) {
        console.log("Error " + err);
    }

    res.send("Updated");
});

// get all events id from notifications property
router.get("/all/:id", async (req, res) => {
    const id = req.params.id;
    const notification = await User.findById({ _id: id });

    // res.json(notification);
    const notificationList = notification.notification;

    const list = await Promise.all(
        notificationList.map(async (Id) => {
            return await Events.find({ _id: Id.notificationId, accept: true });
        })
    );

    res.status(200).json(list.flat());
});

// all raw events
router.get("/allRaw", async (req, res) => {
    Events.find({ accept: false }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});
//count all raw events
router.get("/countRawEvent", async (req, res) => {
    // Count the number of jobs with accept set to false
    const numEvents = await Events.countDocuments({ accept: false });

    // Return the count in the response
    res.json({ numEvents });
});

//get single event and when click thhe read will be true
router.get("/event/:id", async (req, res) => {
    const event = await Events.findById(req.params.id);

    res.json(event);
    // const userEvent = await User.updateOne(
    //     { "notification.notificationId": req.params.id },
    //     { $set: { "notification.$.read": true } }
    // );
    // const userEvent = await User.find({
    //     "notification.notificationId": req.params.id,
    // });
    // console.log(userEvent);

    // if (event) {
    //     if (event.read === false) {
    //     }
    // } else {
    //     res.status(404);
    // }
});

//delete eventh
router.delete("/deleteEvent/:id", async (req, res) => {
    const id = req.params.id;
    await Events.findByIdAndRemove(id).exec();

    res.send("item deleted");
    console.log("na delete ng job");
});

module.exports = router;
