import React, { useEffect, useState } from "react";
import "./acceptevents.css";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

import { format } from "timeago.js";
import FadeLoader from "react-spinners/FadeLoader";
import { motion } from "framer-motion";

//para dialog
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

//icons
import { IoCloseSharp, IoLocationSharp } from "react-icons/io5";
import { FiDelete } from "react-icons/fi";
import { BsCheck2Square } from "react-icons/bs";
import { FaBriefcase } from "react-icons/fa";

const RawEvents = ({ user }) => {
    //para form
    const [title, setTitle] = useState("");
    const [postDate, setPostDate] = useState("");
    const [location, setLocation] = useState("");
    const [where, setWhere] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState();
    const [eventData, setEventData] = useState([]);
    const [message, setMessage] = useState(null);

    // para kuha sa usa ka data sa user
    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        axios
            .get("https://ctu-alumni.onrender.com/api/users/user/" + user)
            .then((res) => {
                setUserInfo(res.data);
                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userInfo]);

    //fetch all raw job nga wala pa na accept sa Admin
    useEffect(() => {
        axios
            .get("https://ctu-alumni.onrender.com/api/events/allRaw")
            .then((res) => {
                setEventData(res.data);
                setLoading(false);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [eventData]);
    // let RawEvents = [];
    // jobData.map((job) => {
    //     RawEvents.push(job.ownerId);
    // });
    // console.log(RawEvents);
    //loading page
    const [loading, setLoading] = useState(false);

    const toggle_arrow = (e) => {
        setOpen(true);
    };

    //snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const SnackbarType = {
        success: "success",
        fail: "fail",
    };

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

    // accept job from users
    const acceptEvent = (id) => {
        axios
            .put("http://localhost:8080/api/events/acceptEvent", {
                id: id,
            })
            .then(() => {
                setMessage("Job accepted");
                setShowSnackbar(true);
                setTimeout(() => {
                    setShowSnackbar(false);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // delete Job or reject job from user
    const deleteEvent = (id) => {
        axios
            .delete(`http://localhost:8080/api/events/deleteEvent/${id}`)
            .then(() => {
                setMessage("Event Rejected");
                setShowSnackbar(true);
                setEventData(eventData.filter((event) => event._id !== id));
                setTimeout(() => {
                    setShowSnackbar(false);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
            });

        //
    };

    return (
        <div className="accepJobs_container">
            {/* snackbar notif */}
            <div
                className="snackbar_position"
                id={showSnackbar ? "show" : "hide"}
            ></div>
            <div className="header_jobs">
                <div className="header_left">
                    <h5>Accept Events from Users</h5>
                </div>

                {/* para accept og job */}
                <div className="header_right"></div>
            </div>

            <div className="accept_body_container">
                {eventData.length > 0 ? (
                    eventData
                        .map((job, key) => {
                            return (
                                <div className="accept_card">
                                    <Link
                                        to={"/user/" + job.ownerId}
                                        className="accept_card_top"
                                    >
                                        <img
                                            src={`http://localhost:8080/uploads/${job.ownerPhoto}`}
                                            alt="picture"
                                        />
                                        <div className="accept_card_topMid">
                                            <h5>{job.ownerName}</h5>
                                            <p>{format(job.date)}</p>
                                        </div>
                                    </Link>

                                    <div className="accept_card_body">
                                        <h2>Events Title : {job.title}</h2>
                                        <p>When : {job.postDate}</p>
                                        <p>Venue : {job.where}</p>

                                        <p>Description : {job.description}</p>
                                    </div>

                                    <div className="accept_card_bottomRight">
                                        <button
                                            onClick={() => {
                                                acceptEvent(job._id);
                                            }}
                                        >
                                            <BsCheck2Square className="accept_button" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => {
                                                deleteEvent(job._id);
                                            }}
                                        >
                                            <FiDelete className="reject_button" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                        .sort()
                        .reverse()
                ) : (
                    <h5 className="noJobs">No Events posted from Users</h5>
                )}
            </div>
        </div>
    );
};

export default RawEvents;
