import React from "react";
import axios from "axios";
import "./../JobPosting/jobposting.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
// import { useHistory } from "react-router-dom";

//para dialog
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

//icons
import { IoLocationSharp } from "react-icons/io5";
import { FaBriefcase } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
// import { GrFormClose } from "react-icons/gr";

import Snackbar from "../../components/Snackbar/Snackbar";

const ArticlesPage = ({ user }) => {
    const [rightData, setRightData] = useState([]);

    const { id } = useParams(); // get the id from the URL

    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);

    // state para update
    const [newTitle, setNewTitle] = useState(rightData.title);
    const [newCompanyName, setNewCompanyName] = useState(rightData.companyName);
    const [newLocation, setNewLocation] = useState(rightData.location);
    const [newEntryLevel, setNewEntryLevel] = useState(rightData.entryLevel);
    const [newDescription, setNewDescription] = useState(rightData.description);

    const [newFileName, setNewFileName] = useState();
    // para state sa file
    const onChangeFile = (e) => {
        setNewFileName(e.target.files[0]);
        handleClickOpenSave(true);
    };
    const toggle_arrow = (e) => {
        setOpen(true);
    };

    //snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showDeleteSnackbar, setShowDeleteSnackbar] = useState(false);
    const SnackbarType = {
        success: "success",
        fail: "fail",
    };

    //para update nga state

    // display 1 data
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/jobs/job/" + id)
            .then((res) => {
                setRightData(res.data);

                console.log(rightData);
                console.log("title:" + res.data.title);
                console.log("CompanyName:" + res.data.companyName);
                console.log("Location:" + res.data.location);
            })
            .catch((err) => {
                console.log("error ni" + err);
            });
    }, [id]);

    // update job
    const updateJob = (id) => {
        axios
            .put("http://localhost:8080/api/jobs/updateJob", {
                id: id,
                newTitle: newTitle,
                newCompanyName: newCompanyName,
                newLocation: newLocation,
                newEntryLevel: newEntryLevel,
                newDescription: newDescription,
            })
            .then(() => {
                handleClose();
                setShowSnackbar(true);
                setTimeout(() => {
                    window.location = `/job/${id}`;
                    // window.location = "/jobposting";
                    setShowSnackbar(false);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // para Dialog sa Image upload
    const [openSave, setOpenSave] = useState(false);
    const handleClickOpenSave = () => {
        setOpenSave(true);
    };
    const handleCloseSave = () => {
        setOpenSave(false);
    };
    // update job Logo
    const changeOnClick = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", id);
        formData.append("companyLogo", newFileName);

        axios
            .put("http://localhost:8080/api/jobs/updateJobLogo", formData)
            .then(() => {
                handleClose();
                setShowSnackbar(true);
                setTimeout(() => {
                    window.location = `/job/${id}`;
                    // window.location = "/jobposting";
                    setShowSnackbar(false);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //fetch all job
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/jobs/all")
            .then((res) => {
                setData(res.data);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [data]);

    // delete Job
    const deleteJob = (id) => {
        axios
            .delete(`http://localhost:8080/api/jobs/deleteJob/${id}`)
            .then(() => {
                console.log("success");

                setShowDeleteSnackbar(true);
                setTimeout(() => {
                    window.location = "/jobposting";
                    setShowSnackbar(false);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
            });
        setData(data.filter((job) => job._id !== id));

        //
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

    // Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const handleClickOpen = () => {
        setOpenDialog(true);
    };
    const handleClose = () => {
        setOpenDialog(false);
    };

    return (
        <div className="jobposting_containers">
            {/* snackbar notif */}
            <div
                className="snackbar_position"
                id={showSnackbar ? "show" : "hide"}
            >
                <Snackbar
                    message={"Succesfully Updated"}
                    type={SnackbarType.success}
                />
            </div>
            <div
                className="snackbar_position"
                id={showDeleteSnackbar ? "show" : "hide"}
            >
                <Snackbar
                    message={"Succesfully Deleted"}
                    type={SnackbarType.success}
                />
            </div>
            {/* header */}
            <div className="header_job">
                <h1>Jobs</h1>
            </div>
            <div className="jobBody">
                <div className="lefts">
                    {data.map((val, key) => {
                        return (
                            <NavLink
                                to={"/job/" + val._id}
                                key={val._id}
                                className="lefts_card"
                                onClick={toggle_arrow}
                            >
                                <div className="">
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
                                        {val.description.substring(0, 180)}....
                                    </p>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
                <div className="rights">
                    {rightData != null && (
                        <div>
                            <div className="hey">
                                <img
                                    src={`http://localhost:8080/companyLogo/${rightData.companyLogo}`}
                                    alt="picture"
                                />
                                {userInfo.isAdmin && (
                                    <div
                                        className="button_holder_job"
                                        title="Edit"
                                    >
                                        <button className="userListEdit">
                                            <BiEdit
                                                className="editBi"
                                                onClick={handleClickOpen}
                                            />
                                        </button>
                                        {/* button update and delete Job post */}
                                        <div
                                            className="button_holder_job"
                                            title="Delete"
                                        >
                                            <button
                                                className="delete_button"
                                                onClick={() => {
                                                    deleteJob(id);
                                                }}
                                            >
                                                <RiDeleteBin5Line className="deleteBi" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="right_title">
                                {rightData && <h1>{rightData.title}</h1>}
                            </div>

                            <div className="rights_companyName">
                                <h5>{rightData.companyName}</h5>
                            </div>

                            <div className="rights_location">
                                <p>{rightData.location}</p>
                            </div>

                            <div className="rights_entryLevel">
                                <h5>Required Skills And Experience</h5>
                                <p>{rightData.entryLevel}</p>
                            </div>

                            <div className="rights_description">
                                <h5>Job Description</h5>
                                <p>{rightData.description}</p>
                            </div>

                            {/* dialog for edit job */}
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
                                    // transition={{
                                    //     type: "spring",
                                    //     stiffness: 300,
                                    // }}
                                    className="sidebar_dialog"
                                >
                                    <div className="header_job">
                                        <DialogTitle>
                                            <h5>Add Job List</h5>
                                        </DialogTitle>
                                        <Button
                                            className="btn_close"
                                            onClick={handleClose}
                                        >
                                            <IoCloseSharp className="close_icon" />
                                        </Button>
                                    </div>

                                    {/* title companyName location entryLevel description */}

                                    <div className="input_job_div">
                                        {/* para update sa companyLogo sa job posting */}
                                        <form
                                            encType="multipart/form-data"
                                            method="post"
                                        >
                                            <div className="job_input_holder">
                                                <h5>CompanyLogo</h5>
                                                <input
                                                    type="file"
                                                    filename="companyLogo"
                                                    onChange={onChangeFile}
                                                    required
                                                    style={{
                                                        border: "none",
                                                        background: "white",
                                                    }}
                                                ></input>
                                            </div>
                                            {/* save dialog */}
                                            <Dialog
                                                open={openSave}
                                                onClose={handleClose}
                                                className="dialog_pic"
                                            >
                                                <div className="header_update_pic">
                                                    <DialogTitle className="dialog_title">
                                                        <h5>
                                                            Upload Company Logo
                                                        </h5>
                                                    </DialogTitle>
                                                    <Button
                                                        className="btn_close"
                                                        onClick={handleClose}
                                                    >
                                                        x
                                                    </Button>
                                                </div>

                                                <div className="button_holder_pic">
                                                    <button
                                                        className="btn_cancel_pic"
                                                        onClick={handleClose}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn_save_pic"
                                                        onClick={changeOnClick}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </Dialog>
                                        </form>
                                        <div className="job_input_holder">
                                            <h5>Job Title</h5>
                                            <input
                                                name="job_title"
                                                type="text"
                                                className="job_title"
                                                defaultValue={rightData.title}
                                                onChange={(e) =>
                                                    setNewTitle(e.target.value)
                                                }
                                            ></input>
                                        </div>

                                        <div className="job_input_holder">
                                            <h5>Company Name</h5>
                                            <input
                                                name="job_company"
                                                type="text"
                                                className="job_company"
                                                defaultValue={
                                                    rightData.companyName
                                                }
                                                onChange={(e) =>
                                                    setNewCompanyName(
                                                        e.target.value
                                                    )
                                                }
                                            ></input>
                                        </div>

                                        <div className="job_input_holder">
                                            <h5>Location</h5>
                                            <input
                                                name="job_location"
                                                type="text"
                                                className="job_location"
                                                defaultValue={
                                                    rightData.location
                                                }
                                                onChange={(e) =>
                                                    setNewLocation(
                                                        e.target.value
                                                    )
                                                }
                                            ></input>
                                        </div>
                                        <div className="job_input_holder">
                                            <h5>Qualifications</h5>
                                            <textarea
                                                name="job_entry"
                                                type="text"
                                                className="job_entry"
                                                defaultValue={
                                                    rightData.entryLevel
                                                }
                                                onChange={(e) =>
                                                    setNewEntryLevel(
                                                        e.target.value
                                                    )
                                                }
                                            ></textarea>
                                        </div>

                                        <div className="job_input_holder">
                                            <h5>Job Description</h5>
                                            <textarea
                                                name="job_description"
                                                type="text"
                                                className="job_description"
                                                defaultValue={
                                                    rightData.description
                                                }
                                                onChange={(e) =>
                                                    setNewDescription(
                                                        e.target.value
                                                    )
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                    {/* </form> */}

                                    {/* button save para edit sa job */}
                                    <div className="button_save">
                                        <button
                                            onClick={() => {
                                                updateJob(rightData._id);
                                            }}
                                        >
                                            Post Job
                                        </button>
                                    </div>
                                </motion.div>
                            </Dialog>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticlesPage;
