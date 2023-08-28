require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const eventsRoutes = require("./routes/events");
const requestRoutes = require("./routes/request");
const jobDetailsRoutes = require("./routes/jobDetails");
const bodyParser = require("body-parser");

// database connectionn
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/jobDetails", jobDetailsRoutes);

//para maka access image nga naa gawas sa SRC folder
app.use("/uploads", express.static("uploads"));
app.use("/companyLogo", express.static("companyLogo"));
app.use("/eventPic", express.static("eventPic"));
app.use("/companyId", express.static("companyId"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || "https://ctu-alumni.onrender.com";
app.listen(port, console.log(`Listening on port ${port}...`));
