import React, { useEffect, useState } from "react";
import "./joblist.css";
import { format } from "timeago.js";
import { motion } from "framer-motion";
import FadeLoader from "react-spinners/FadeLoader";
// /snackbar
import Snackbar from "../../components/Snackbar/Snackbar";

//para dialog
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";

//icons
import { IoLocationSharp, IoTelescope } from "react-icons/io5";
import { FaBriefcase } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

import {} from "react-icons/io5";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
const JobPosting = ({ children, user }) => {
    const { id } = useParams(); // get the id from the URL

    //para form
    const [title, setTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [entryLevel, setEntryLevel] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);

    const [fileName, setFileName] = useState(data.companyLogo);

    //loading page
    const [loading, setLoading] = useState(true);

    const toggle_arrow = (e) => {
        setOpen(true);
    };

    //filter search
    const [filter, setFilter] = useState("");

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

    //fetch all accepted job
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/jobs/all")
            .then((res) => {
                setData(res.data);

                setLoading(false);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [data]);

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

    const [countRawJob, setCountRawJob] = useState();
    //fetch all raw job nga wala pa na accept sa Admin
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/jobs/countRawJob")
            .then((res) => {
                setCountRawJob(res.data.numJobs);
                setLoading(false);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [countRawJob]);

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
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };

    let [color, setColor] = useState("#36d7b7");
    // add job

    // para pagination

    return (
        <>
            <div className="jobposting_containers">
                <ScrollToTop />
                {/* snackbar notif */}
                <div
                    className="snackbar_position"
                    id={showSnackbar ? "show" : "hide"}
                >
                    <Snackbar
                        message={"Job Added Succesfully"}
                        type={SnackbarType.success}
                    />
                </div>

                <div className="header_jobs">
                    <div className="header_left">
                        <h5>Job List</h5>
                        <input
                            type="text"
                            placeholder="Search Keyword..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="search_input"
                        />
                    </div>

                    {/* para add og job */}
                    <div className="header_right">
                        {userInfo.isAdmin ? (
                            <NavLink
                                exact={true}
                                key="JobList"
                                to="/jobposting/acceptjobs"
                                className="accept_jobs"
                            >
                                Accept Job
                                {countRawJob > 0 ? (
                                    <span className="jobCounter">
                                        {countRawJob}
                                    </span>
                                ) : null}
                            </NavLink>
                        ) : null}

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
                        maxWidth="md"
                    >
                        <motion.div
                            animate={{
                                height: openDialog ? "505px" : "0px",
                                width: "850px",
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="sidebar_dialog"
                        >
                            <div className="header_job">
                                <DialogTitle>
                                    <h4>Add Job </h4>
                                </DialogTitle>
                                <Button
                                    className="btn_close"
                                    onClick={handleClose}
                                >
                                    <IoCloseSharp className="close_icon" />
                                </Button>
                            </div>
                            {/* title companyName location entryLevel description */}
                            <form encType="multipart/form-data" method="post">
                                <div className="input_job_div">
                                    <div className="job_input_holder">
                                        <h5>Job Logo</h5>
                                        <input
                                            type="file"
                                            fileName="companyLogo"
                                            onChange={onChangeFile}
                                            style={{
                                                border: "none",
                                                background: "white",
                                            }}
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
                                        <textarea
                                            name="job_entry"
                                            type="text"
                                            className="job_entry"
                                            onChange={(e) =>
                                                setEntryLevel(e.target.value)
                                            }
                                        ></textarea>
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

                {/* job body container */}
                <div className="jobBodys">
                    <div className="leftss">
                        {data
                            .filter((item) => {
                                return (
                                    item.title
                                        .toLowerCase()
                                        .includes(filter.toLowerCase()) ||
                                    item.companyName
                                        .toLowerCase()
                                        .includes(filter.toLowerCase()) ||
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
                                        onClick={toggle_arrow}
                                    >
                                        <div>
                                            <img
                                                src={`http://localhost:8080/companyLogo/${val.companyLogo}`}
                                                alt="picture"
                                            />
                                        </div>
                                        <div className="lefts_cards_title">
                                            <h1>{val.title}</h1>
                                        </div>
                                        <div className="lefts_cards_companyname">
                                            <h4>{val.companyName}</h4>
                                        </div>
                                        <div className="lefts_cards_location">
                                            <IoLocationSharp className="icon" />
                                            <h5>{val.location}</h5>
                                        </div>
                                        <div className="lefts_cards_entrylevel">
                                            <FaBriefcase className="icon" />
                                            <h5>{val.entryLevel}</h5>
                                        </div>

                                        <div className="lefts_cards_p">
                                            <p>
                                                {val.description.substring(
                                                    0,
                                                    180
                                                )}
                                                ....
                                            </p>
                                        </div>

                                        <div className="job_card_footer">
                                            <button className="button">
                                                Read More
                                            </button>
                                            <p>{format(val.postDate)}</p>
                                        </div>
                                    </NavLink>
                                );
                            })
                            .sort()
                            .reverse()}
                    </div>
                </div>

                <h1>yeah</h1>
            </div>
        </>
    );
};

export default JobPosting;
