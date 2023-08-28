import React, { useState, useEffect } from "react";

import "./events.css";
import { NavLink } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";

import FadeLoader from "react-spinners/FadeLoader";
import { AiOutlineSearch } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
//para dialog
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { useParams } from "react-router-dom";

import madara from "../../images/madara.jpg";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import Snackbar from "../Snackbar/Snackbar";

const Events = ({ user }) => {
    const [data, setData] = useState([]);
    const [fileName, setFileName] = useState();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [course, setCourse] = useState("");
    const [year, setYear] = useState("");
    const [date, setDate] = useState("");
    const [where, setWhere] = useState("");

    //fetch all job
    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/events/all/${user}`)
            .then((res) => {
                setData(res.data);
                setLoading(false);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [data]);

    //loading page
    const [loading, setLoading] = useState(false);

    //color sa loading spinner
    let [color, setColor] = useState("#36d7b7");

    //filter para search
    const [filter, setFilter] = useState("");

    // Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const handleClickOpen = () => {
        setOpenDialog(true);
    };
    const handleClose = () => {
        setOpenDialog(false);
    };

    // para state sa file
    const onChangeFile = (e) => {
        setFileName(e.target.files[0]);
    };

    //snackbar
    const [message, setMessage] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const SnackbarType = {
        success: "success",
        fail: "fail",
    };

    //para add og Event
    const handleSubmit = () => {
        const formData = new FormData();
        const ownerName = userInfo.firstName + " " + userInfo.lastName;
        formData.append("ownerId", userInfo._id);
        formData.append("ownerName", ownerName);
        formData.append("ownerPhoto", userInfo.profilePic);
        formData.append("eventPic", fileName);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("date", date);
        formData.append("where", where);
        formData.append("category", category);
        if (category === "Reunion") {
            formData.append("course", course);
            formData.append("year", year);
        }
        axios.post("http://localhost:8080/api/events/addEvent", formData);

        handleClose();
        setMessage("Event Added Succesfully");
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };

    // para kuha sa usa ka data sa user
    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/user/" + user)
            .then((res) => {
                setUserInfo(res.data);
                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userInfo]);

    //fetch all raw event nga wala pa na accept sa Admin
    const [countRawEvent, setCountRawEvent] = useState();
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/events/countRawEvent")
            .then((res) => {
                setCountRawEvent(res.data.numEvents);
                setLoading(false);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [countRawEvent]);

    return (
        <>
            {loading ? (
                <div className="loading_page">
                    <div className="loading_center">
                        <FadeLoader
                            loading={loading}
                            size={200}
                            aria-label="Loading Spinner"
                            color={color}
                        />
                        <label htmlFor="">Loading...</label>
                    </div>
                </div>
            ) : (
                <div className="events_container">
                    <ScrollToTop />
                    {/* snackbar notif */}
                    <div
                        className="snackbar_position"
                        id={showSnackbar ? "show" : "hide"}
                    >
                        <Snackbar
                            message={message}
                            type={SnackbarType.success}
                        />
                    </div>
                    <div className="events_header">
                        <h1>Events</h1>

                        {/* para add og accept sa Event */}
                        <div className="header_right">
                            {/* accept event button */}
                            {userInfo.isAdmin ? (
                                <NavLink
                                    exact={true}
                                    key="RawEvents"
                                    to="/events/acceptevents"
                                    className="accept_jobs"
                                >
                                    Accept Events
                                    {countRawEvent > 0 ? (
                                        <span className="jobCounter">
                                            {countRawEvent}
                                        </span>
                                    ) : null}
                                </NavLink>
                            ) : null}

                            <motion.button
                                onClick={handleClickOpen}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Add Event
                            </motion.button>
                        </div>
                        {/* dialog for add Job*/}
                        <Dialog
                            open={openDialog}
                            onClose={handleClose}
                            className="job_dialog"
                            maxWidth="md"
                        >
                            <motion.div
                                animate={{
                                    height: openDialog ? "500px" : "0px",
                                    width: "750px",
                                }}
                                className="sidebar_dialog"
                            >
                                <div className="header_job">
                                    <DialogTitle>
                                        <h4>Add Event </h4>
                                    </DialogTitle>
                                    <Button
                                        className="btn_close"
                                        onClick={handleClose}
                                    >
                                        <IoCloseSharp className="close_icon" />
                                    </Button>
                                </div>
                                {/* title companyName location entryLevel description */}
                                <form
                                    encType="multipart/form-data"
                                    method="post"
                                >
                                    <div className="input_event_div">
                                        {/* title */}
                                        <div
                                            className="event_input_holder"
                                            style={{ width: "100%" }}
                                        >
                                            <h5>Title</h5>
                                            <input
                                                name="job_title"
                                                type="text"
                                                className="job_title"
                                                required
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                            ></input>
                                        </div>

                                        {/* category */}
                                        <div
                                            className="event_input_holder"
                                            style={{ width: "325px" }}
                                        >
                                            <h5>Category</h5>
                                            <select
                                                name="job_title"
                                                className="job_title"
                                                required
                                                onChange={(e) =>
                                                    setCategory(e.target.value)
                                                }
                                            >
                                                <option value="">
                                                    -Select-
                                                </option>
                                                <option value="Reunion">
                                                    Reunion
                                                </option>
                                                <option value="Career networking events">
                                                    Career networking events
                                                </option>

                                                <option value="Fundraising events">
                                                    Fundraising events
                                                </option>
                                            </select>
                                        </div>

                                        {/* event photo */}
                                        <div
                                            className="event_input_holder"
                                            style={{ width: "330px" }}
                                        >
                                            <h5>Upload Photo</h5>
                                            <input
                                                type="file"
                                                fileName="eventsPic"
                                                onChange={onChangeFile}
                                                style={{ border: "none" }}
                                            ></input>
                                        </div>

                                        {/* course */}
                                        {category === "Reunion" && (
                                            <div className="event_input_holder_holder">
                                                <h5>Course</h5>
                                                <select
                                                    name="job_title"
                                                    className="job_title"
                                                    required
                                                    onChange={(e) =>
                                                        setCourse(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        category === "Reunion"
                                                            ? false
                                                            : true
                                                    }
                                                >
                                                    <option value="">
                                                        --Select--
                                                    </option>
                                                    <option value="BAL">
                                                        Bachelor of Arts In
                                                        Literature
                                                    </option>
                                                    <option value="BAEL">
                                                        Bachelor of Arts in
                                                        English Languange
                                                    </option>
                                                    <option value="BTLED">
                                                        Bachelor of Techology
                                                        and Livelihood Education
                                                    </option>
                                                    <option value="BSED">
                                                        Bachelor of Secondary
                                                        Education
                                                    </option>
                                                    <option value="BEED">
                                                        Bachelor of Elementary
                                                        Education
                                                    </option>
                                                    <option value="BSIE">
                                                        Bachelor of Science in
                                                        Industrial Engineering
                                                    </option>
                                                    <option value="BSIT">
                                                        Bachelor of Science in
                                                        Information Technology
                                                    </option>
                                                    <option value="BIT-Garments">
                                                        BIT Garments
                                                    </option>
                                                    <option value="BIT-Drafting">
                                                        BIT Drafting
                                                    </option>
                                                    <option value="BIT-Computer-Technology">
                                                        BIT Computer Technology
                                                    </option>
                                                    <option value="BIT-Automotive">
                                                        BIT Automotive
                                                    </option>
                                                    <option value="BIT-Electronics">
                                                        BIT Electronics
                                                    </option>

                                                    <option value="BSA">
                                                        Bachelor of Science in
                                                        Agriculture
                                                    </option>
                                                    <option value="BSHM">
                                                        Bachelor of Science in
                                                        Hospitality Management
                                                    </option>
                                                </select>
                                            </div>
                                        )}

                                        {/* school year */}
                                        {category === "Reunion" && (
                                            <div className="event_input_holder_holder">
                                                <h5>School Year</h5>
                                                <input
                                                    name="job_title"
                                                    type="text"
                                                    className="job_title"
                                                    required
                                                    disabled={
                                                        category === "Reunion"
                                                            ? false
                                                            : true
                                                    }
                                                    onChange={(e) =>
                                                        setYear(e.target.value)
                                                    }
                                                ></input>
                                            </div>
                                        )}

                                        <div className="event_input_holders">
                                            <h5>Description</h5>
                                            <textarea
                                                name="job_description"
                                                type="text"
                                                className="job_description"
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value
                                                    )
                                                }
                                            ></textarea>
                                        </div>

                                        {/* input para date */}
                                        <div
                                            className="event_input_holder"
                                            style={{
                                                width: "265px",
                                                "margin-top": "0",
                                            }}
                                        >
                                            <h5>Date</h5>
                                            <input
                                                name="job_description"
                                                type="date"
                                                className="job_title"
                                                onChange={(e) =>
                                                    setDate(e.target.value)
                                                }
                                            ></input>
                                        </div>

                                        {/* location sa event */}
                                        <div
                                            className="event_input_holder"
                                            style={{ width: "390px" }}
                                        >
                                            <h5>Location</h5>
                                            <input
                                                name="job_description"
                                                type="text"
                                                className="job_title"
                                                onChange={(e) =>
                                                    setWhere(e.target.value)
                                                }
                                            ></input>
                                        </div>
                                    </div>
                                </form>

                                <div className="event_button_save">
                                    <motion.button
                                        onClick={() => {
                                            handleSubmit();
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        Submit
                                    </motion.button>
                                </div>
                            </motion.div>
                        </Dialog>
                    </div>
                    <div className="events_body">
                        <div className="events_body_header">
                            <AiOutlineSearch className="search_icon" />
                            <input
                                type="text"
                                placeholder="Search ..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="search_input"
                            />
                        </div>
                        <div className="events_body_cards_container">
                            <div className="events_body_cards">
                                {data.length > 0 ? (
                                    data
                                        .filter((item) => {
                                            return (
                                                item.title
                                                    .toLowerCase()
                                                    .includes(
                                                        filter.toLowerCase()
                                                    ) ||
                                                item.description
                                                    .toLowerCase()
                                                    .includes(
                                                        filter.toLowerCase()
                                                    )
                                            );
                                        })
                                        .map((val, key) => {
                                            return (
                                                <NavLink
                                                    key={val._id}
                                                    to={"/event/" + val._id}
                                                    className="event_cards"
                                                    title="Click me"
                                                >
                                                    <Card
                                                        sx={{
                                                            maxWidth: 250,
                                                            height: 355,
                                                        }}
                                                        className="event_c"
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            alt="green iguana"
                                                            height="160"
                                                            image={`http://localhost:8080/eventPic/${val.eventPic}`}
                                                        />

                                                        <CardContent>
                                                            <p>
                                                                {
                                                                    val.postDate.split(
                                                                        "T"
                                                                    )[0]
                                                                }
                                                            </p>
                                                            <h5>{val.title}</h5>
                                                            <p>
                                                                {val.description.substring(
                                                                    0,
                                                                    80
                                                                )}
                                                                {".."}
                                                            </p>
                                                        </CardContent>
                                                        <CardActions>
                                                            <button className="button">
                                                                Read More
                                                            </button>
                                                        </CardActions>
                                                    </Card>
                                                </NavLink>
                                            );
                                        })
                                        .sort()
                                        .reverse()
                                ) : (
                                    <h5 className="noJobs">
                                        No Events for you
                                    </h5>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
{
    /* {data
                                    .filter((item) => {
                                        return (
                                            item.title
                                                .toLowerCase()
                                                .includes(
                                                    filter.toLowerCase()
                                                ) ||
                                            item.companyName
                                                .toLowerCase()
                                                .includes(
                                                    filter.toLowerCase()
                                                ) ||
                                            item.description
                                                .toLowerCase()
                                                .includes(filter.toLowerCase())
                                        );
                                    })
                                    .map((val, key) => {
                                        return (
                                            <NavLink
                                                to={"/job/" + val._id}
                                                key={val._id}
                                                className="lefts_cards"
                                            ></NavLink>
                                        );
                                    })
                                    .sort()
                                    .reverse()} */
}
export default Events;
