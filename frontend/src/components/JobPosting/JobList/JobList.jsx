import React, { useEffect, useState } from "react";
import "./acceptjobs.css";

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

import ScrollToTop from "../../ScrollToTop/ScrollToTop";
import Snackbar from "../../Snackbar/Snackbar";
import { FaBriefcase } from "react-icons/fa";

const JobList = ({ user }) => {
    //para form
    const [title, setTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [entryLevel, setEntryLevel] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [fileName, setFileName] = useState();
    const [jobData, setJobData] = useState([]);
    const [message, setMessage] = useState(null);

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

    //fetch all raw job nga wala pa na accept sa Admin
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/jobs/allRaw")
            .then((res) => {
                setJobData(res.data);
                setLoading(false);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [jobData]);

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

    //para add og job
    const handleSubmit = () => {
        const formData = new FormData();
        const ownerName = userInfo.firstName + " " + userInfo.lastName;
        formData.append("ownerId", userInfo._id);
        formData.append("ownerName", ownerName);
        formData.append("ownerPhoto", userInfo.profilePic);
        formData.append("companyLogo", fileName);
        formData.append("title", title);
        formData.append("companyName", companyName);
        formData.append("location", location);
        formData.append("entryLevel", entryLevel);
        formData.append("description", description);

        axios.post("http://localhost:8080/api/jobs/add", formData);

        handleClose();
        setMessage("Job Added Succesfully");
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };

    //filter search
    const [filter, setFilter] = useState("");

    // accept job from users
    const acceptJob = (id) => {
        axios
            .put("http://localhost:8080/api/jobs/acceptJob", {
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
    const deleteJob = (id) => {
        axios
            .delete(`http://localhost:8080/api/jobs/deleteJob/${id}`)
            .then(() => {
                setMessage("Job Rejected");
                setShowSnackbar(true);
                setJobData(jobData.filter((job) => job._id !== id));
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
            <ScrollToTop />
            {/* snackbar notif */}
            <div
                className="snackbar_position"
                id={showSnackbar ? "show" : "hide"}
            >
                <Snackbar message={message} type={SnackbarType.success} />
            </div>
            <div className="header_jobs">
                <div className="header_left">
                    <h5>Accept Jobs from Users</h5>
                </div>

                {/* para accept og job */}
                <div className="header_right">
                    <motion.button
                        onClick={handleClickOpen}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Add Job
                    </motion.button>
                </div>
                {/* dialog for add Job*/}
                <Dialog
                    open={openDialog}
                    onClose={handleClose}
                    className="job_dialog"
                >
                    <motion.div
                        animate={{
                            height: openDialog ? "520px" : "0px",
                            width: "550px",
                        }}
                        className="sidebar_dialog"
                    >
                        <div className="header_job">
                            <DialogTitle>
                                <h4>Add Job </h4>
                            </DialogTitle>
                            <Button className="btn_close" onClick={handleClose}>
                                <IoCloseSharp className="close_icon" />
                            </Button>
                        </div>
                        {/* title companyName location entryLevel description */}
                        <form encType="multipart/form-data" method="post">
                            <div className="input_job_div">
                                <div className="job_input_holder">
                                    <h5>Job Title</h5>
                                    <input
                                        type="file"
                                        fileName="companyLogo"
                                        onChange={onChangeFile}
                                    ></input>
                                </div>

                                <div className="job_input_holder">
                                    <h5>Job Title</h5>
                                    <input
                                        name="job_title"
                                        type="text"
                                        className="job_title"
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    ></input>
                                </div>

                                <div className="job_input_holder">
                                    <h5>Company Name</h5>
                                    <input
                                        name="job_company"
                                        type="text"
                                        className="job_company"
                                        onChange={(e) =>
                                            setCompanyName(e.target.value)
                                        }
                                    ></input>
                                </div>

                                <div className="job_input_holder">
                                    <h5>Location</h5>
                                    <input
                                        name="job_location"
                                        type="text"
                                        className="job_location"
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                    ></input>
                                </div>
                                <div className="job_input_holder">
                                    <h5>Qualifications</h5>
                                    <input
                                        name="job_entry"
                                        type="text"
                                        className="job_entry"
                                        onChange={(e) =>
                                            setEntryLevel(e.target.value)
                                        }
                                    ></input>
                                </div>

                                <div className="job_input_holder">
                                    <h5>Job Description</h5>
                                    <textarea
                                        name="job_description"
                                        type="text"
                                        className="job_description"
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    ></textarea>
                                </div>
                            </div>
                        </form>

                        <div className="button_save">
                            <motion.button
                                onClick={() => {
                                    handleSubmit();
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Post Job
                            </motion.button>
                        </div>
                    </motion.div>
                </Dialog>
            </div>

            <div className="accept_body_container">
                {jobData.length > 0 ? (
                    jobData
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
                                            <p>{format(job.postDate)}</p>
                                        </div>
                                    </Link>

                                    <div className="accept_card_body">
                                        <h2>Job Title : {job.title}</h2>
                                        <p>Company Name : {job.companyName}</p>
                                        <p>Location : {job.location}</p>
                                        <p>Qualifications : {job.entryLevel}</p>
                                        <p>Description : {job.description}</p>
                                    </div>

                                    <div className="accept_card_bottomRight">
                                        <button
                                            onClick={() => {
                                                acceptJob(job._id);
                                            }}
                                        >
                                            <BsCheck2Square className="accept_button" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => {
                                                deleteJob(job._id);
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
                    <h5 className="noJobs">No Jobs posted from Users</h5>
                )}
            </div>
        </div>
    );
};

export default JobList;
