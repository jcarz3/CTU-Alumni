import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./resumebuilder.css";
import Snackbar from "../../components/Snackbar/Snackbar";
import { AiOutlinePlusCircle } from "react-icons/ai";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

import { FaUserAlt } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { PDFExport } from "@progress/kendo-react-pdf";

import { motion } from "framer-motion";
//para dialog
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

//icons
import { FaUserCircle, FaSave } from "react-icons/fa";
import { BsFillCameraFill, BsTrash } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCloseCircleSharp, IoCloseSharp } from "react-icons/io5";

const ResumeBuilder = ({ user }) => {
    const pdfExportRef = useRef();

    const [userId, setUserId] = useState();

    //para download pdf
    function generatePDF() {
        pdfExportRef.current.save();
    }

    //state sa input
    const [aboutMe, setAboutMe] = useState();
    const [workExperience, setWorkExperience] = useState([
        { title: "", description: "" },
    ]);

    const [userInfo, setUserInfo] = useState([]);

    //snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const SnackbarType = {
        success: "success",
        fail: "fail",
    };

    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);

    // para kuha sa usa ka data sa user
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/user/" + user)
            .then((res) => {
                setUserInfo(res.data);
                setUserId(res.data._id);
                setExperience(res.data.experience);
                setEducation(res.data.education);
                setSkills(res.data.skills);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userInfo]);

    const generatePDFRef = useRef();
    function handleGeneratePDF() {
        console.log("Generating PDF");
        generatePDFRef.current.generatePDF();
    }

    // =============================================================
    //para Experience details
    const [experienceTitle, setExperienceTitle] = useState();
    const [experienceDescription, setExperienceDescription] = useState();

    // Dialog para Experience details
    const [openDialogExperience, setOpenDialogExperience] = useState(false);
    const handleClickOpenExperience = () => {
        setOpenDialogExperience(true);
    };
    const handleCloseExperience = () => {
        setOpenDialogExperience(false);
    };
    //sa form para Award details ig submit
    const changeonClickExperience = async (e) => {
        e.preventDefault();

        axios
            .put("http://localhost:8080/api/users/addExperience", {
                id: userInfo._id,
                title: experienceTitle,
                description: experienceDescription,
            })
            .then(() => {
                setShowSnackbar(true);
                setTimeout(() => {
                    setShowSnackbar(false);
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // para delete sa experience
    const handleDeleteExperience = (experienceId) => {
        axios
            .put(
                `http://localhost:8080/api/users/deleteExperience/${experienceId}`,
                {
                    userId: userId,
                }
            )
            .then((res) => {
                setExperience(
                    experience.filter((exp) => exp._id !== experienceId)
                );
            });
    };

    // =============================================================
    //para education details
    const [skillsTitle, setSkillsTitle] = useState();

    // Dialog para Experience details
    const [openDialogSkills, setOpenDialogSkills] = useState(false);
    const handleClickOpenSkills = () => {
        setOpenDialogSkills(true);
    };
    const handleCloseSkills = () => {
        setOpenDialogSkills(false);
    };
    //sa form para education details ig submit
    const changeOnClickSkills = async (e) => {
        e.preventDefault();

        axios
            .put("http://localhost:8080/api/users/addSkills", {
                id: userInfo._id,
                title: skillsTitle,
            })
            .then(() => {
                setShowSnackbar(true);
                setTimeout(() => {
                    setShowSnackbar(false);
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // para delete sa education
    const handleDeleteSkills = (skillsId) => {
        axios
            .put(`http://localhost:8080/api/users/deleteSkills/${skillsId}`, {
                userId: userId,
            })
            .then((res) => {
                setSkills(skills.filter((skill) => skill._id !== skillsId));
            });
    };

    // =============================================================
    //para education details
    const [educationTitle, setEducationTitle] = useState();
    const [educationDescription, setEducationDescription] = useState();

    // Dialog para Experience details
    const [openDialogEducation, setOpenDialogEducation] = useState(false);
    const handleClickOpenEducation = () => {
        setOpenDialogEducation(true);
    };
    const handleCloseEducation = () => {
        setOpenDialogEducation(false);
    };
    //sa form para education details ig submit
    const changeOnClickEducation = async (e) => {
        e.preventDefault();

        axios
            .put("http://localhost:8080/api/users/addEducation", {
                id: userInfo._id,
                title: educationTitle,
                location: educationDescription,
            })
            .then(() => {
                setShowSnackbar(true);
                setTimeout(() => {
                    setShowSnackbar(false);
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // para delete sa education
    const handleDeleteEducation = (educationId) => {
        axios
            .put(
                `http://localhost:8080/api/users/deleteEducation/${educationId}`,
                {
                    userId: userId,
                }
            )
            .then((res) => {
                setEducation(
                    education.filter((exp) => exp._id !== educationId)
                );
            });
    };

    return (
        <div className="resume_builder">
            <ScrollToTop />
            {/* snackbar notif */}
            <div
                className="snackbar_position"
                id={showSnackbar ? "show" : "hide"}
            >
                <Snackbar
                    message={"Succesfully Added"}
                    type={SnackbarType.success}
                />
            </div>
            <div className="header_resume">
                <h1>Resume</h1>
            </div>

            <div className="resume_builder_body">
                {/* Work experience details container ======================================= */}
                <div
                    className="job_profile_section"
                    style={{
                        margin: "0 auto",
                        "margin-bottom": "10px",
                        width: "80%",
                    }}
                >
                    <div className="jps_header">
                        <h1>Work Experience</h1>
                        <AiOutlinePlus
                            className="icon"
                            onClick={handleClickOpenExperience}
                        />
                    </div>

                    <div className="job_profile_section_body">
                        {/* experience details .map */}
                        {experience &&
                            experience.map((exp, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="award_card"
                                        style={{
                                            margin: "8px auto",
                                            "border-bottom":
                                                "1px solid #F6F3F3",
                                            padding: "8px 5px",
                                        }}
                                    >
                                        <h5 style={{ fontWeight: "600" }}>
                                            {exp.title}
                                        </h5>

                                        <p
                                            style={{
                                                "margin-bottom": 0,
                                                "margin-right": "50px",
                                            }}
                                        >
                                            {exp.description}
                                        </p>
                                        <button
                                            onClick={() =>
                                                handleDeleteExperience(exp._id)
                                            }
                                        >
                                            <BsTrash className="icon" />
                                            <p>Delete</p>
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
                {/* dialog para add og experience details sa User */}
                <Dialog
                    className="job_details_dialog"
                    open={openDialogExperience}
                    onClose={handleCloseExperience}
                >
                    <motion.div
                        animate={{
                            height: openDialogExperience ? "360px" : "0px",
                            width: "550px",
                        }}
                        className="Id_request_dialog_div"
                    >
                        <div className="header_job">
                            <DialogTitle>
                                <h5>Add Job Details</h5>
                            </DialogTitle>
                            <Button
                                className="btn_close"
                                onClick={handleCloseExperience}
                            >
                                <IoCloseCircleSharp className="close_icon" />
                            </Button>
                        </div>

                        {/* form para sa work details */}
                        <form
                            encType="multipart/form-data"
                            method="post"
                            onSubmit={changeonClickExperience}
                            style={{ "margin-top": 15 }}
                        >
                            {/* title Name*/}
                            <div
                                className="id_input_holder"
                                style={{
                                    width: "90%",
                                    margin: "5px auto",
                                }}
                            >
                                <h5>Title</h5>
                                <input
                                    style={{
                                        border: "1px solid gray",
                                        height: 35,
                                        fontSize: 14,
                                        padding: "1px 5px",
                                        backgroundColor: "#edf7f8",
                                    }}
                                    type="text"
                                    className="job_title"
                                    required
                                    placeholder="Ex. Junior Web Developer"
                                    name="jobTitle"
                                    onChange={(e) =>
                                        setExperienceTitle(e.target.value)
                                    }
                                ></input>
                            </div>

                            {/* Work Description */}
                            <div
                                className="id_input_holder"
                                style={{
                                    width: "90%",
                                    margin: "5px auto",
                                }}
                            >
                                <h5>Description</h5>
                                <textarea
                                    style={{
                                        border: "1px solid gray",
                                        height: "105px",
                                        width: "100%",
                                        fontSize: 14,
                                        padding: "1px 5px",
                                        backgroundColor: "#edf7f8",
                                    }}
                                    type="text"
                                    className="job_title"
                                    required
                                    name="awardDescription"
                                    onChange={(e) =>
                                        setExperienceDescription(e.target.value)
                                    }
                                    // onChange={(e) => setEmail(e.target.value)}
                                ></textarea>
                            </div>

                            <div
                                className="button_save_id"
                                style={{
                                    width: "90%",
                                    display: "flex",
                                    justifyContent: "end",
                                }}
                            >
                                <button onClick={handleCloseExperience}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </Dialog>

                {/* education details ========================================================*/}
                <div
                    className="job_profile_section"
                    style={{
                        margin: "0 auto",
                        "margin-bottom": "10px",
                        width: "80%",
                    }}
                >
                    <div className="jps_header">
                        <h1>Education</h1>
                        <AiOutlinePlus
                            className="icon"
                            onClick={handleClickOpenEducation}
                        />
                    </div>

                    <div className="job_profile_section_body">
                        {/* experience details .map */}
                        {education &&
                            education.map((educ, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="award_card"
                                        style={{
                                            height: "50px",
                                            display: "flex",
                                            "flex-direction": "column",
                                            "border-bottom":
                                                "1px solid #F6F3F3",
                                            padding: "8px 5px",
                                            margin: "5px 0",
                                        }}
                                    >
                                        <h5 style={{ fontWeight: "600" }}>
                                            {educ.title}
                                        </h5>

                                        <p style={{ "margin-bottom": 0 }}>
                                            {educ.location}
                                        </p>
                                        <button
                                            onClick={() =>
                                                handleDeleteEducation(educ._id)
                                            }
                                        >
                                            <BsTrash className="icon" />
                                            <p>Delete</p>
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
                {/* dialog para add og education details sa User */}
                <Dialog
                    className="job_details_dialog"
                    open={openDialogEducation}
                    onClose={handleCloseEducation}
                >
                    <motion.div
                        animate={{
                            height: openDialogEducation ? "360px" : "0px",
                            width: "550px",
                        }}
                        className="Id_request_dialog_div"
                    >
                        <div className="header_job">
                            <DialogTitle>
                                <h5>Add Education Details</h5>
                            </DialogTitle>
                            <Button
                                className="btn_close"
                                onClick={handleCloseEducation}
                            >
                                <IoCloseCircleSharp className="close_icon" />
                            </Button>
                        </div>

                        {/* form para sa work details */}
                        <form
                            encType="multipart/form-data"
                            method="post"
                            onSubmit={changeOnClickEducation}
                            style={{ "margin-top": 15 }}
                        >
                            {/* title Name*/}
                            <div
                                className="id_input_holder"
                                style={{
                                    width: "90%",
                                    margin: "5px auto",
                                }}
                            >
                                <h5>Title</h5>
                                <input
                                    style={{
                                        border: "1px solid gray",
                                        height: 35,
                                        fontSize: 14,
                                        padding: "1px 5px",
                                        backgroundColor: "#edf7f8",
                                    }}
                                    type="text"
                                    className="job_title"
                                    required
                                    name="jobTitle"
                                    onChange={(e) =>
                                        setEducationTitle(e.target.value)
                                    }
                                ></input>
                            </div>

                            {/* Work Description */}
                            <div
                                className="id_input_holder"
                                style={{
                                    width: "90%",
                                    margin: "5px auto",
                                }}
                            >
                                <h5>Description</h5>
                                <textarea
                                    style={{
                                        border: "1px solid gray",
                                        height: "105px",
                                        width: "100%",
                                        fontSize: 14,
                                        padding: "1px 5px",
                                        backgroundColor: "#edf7f8",
                                    }}
                                    type="text"
                                    className="job_title"
                                    required
                                    name="awardDescription"
                                    onChange={(e) =>
                                        setEducationDescription(e.target.value)
                                    }
                                    // onChange={(e) => setEmail(e.target.value)}
                                ></textarea>
                            </div>

                            <div
                                className="button_save_id"
                                style={{
                                    width: "90%",
                                    display: "flex",
                                    justifyContent: "end",
                                }}
                            >
                                <button onClick={handleCloseEducation}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </Dialog>

                {/* skills details============================================= */}
                <div
                    className="job_profile_section"
                    style={{
                        margin: "0 auto",
                        "margin-bottom": "200px",
                        width: "80%",
                    }}
                >
                    <div className="jps_header">
                        <h1>Skills</h1>
                        <AiOutlinePlus
                            className="icon"
                            onClick={handleClickOpenSkills}
                        />
                    </div>

                    <div className="job_profile_section_body">
                        {/* skills details .map */}

                        {skills &&
                            skills.map((skill, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="award_card"
                                        style={{
                                            height: "28px",
                                            display: "flex",
                                            "flex-direction": "column",
                                            "margin-left": "5px",
                                        }}
                                    >
                                        <h5 style={{ fontWeight: "600" }}>
                                            {skill.title}
                                        </h5>

                                        <button
                                            onClick={() =>
                                                handleDeleteSkills(skill._id)
                                            }
                                        >
                                            <BsTrash className="icon" />
                                            <p>Delete</p>
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
                {/* dialog para add og skills details sa User */}
                <Dialog
                    className="job_details_dialog"
                    open={openDialogSkills}
                    onClose={handleCloseSkills}
                >
                    <motion.div
                        animate={{
                            height: openDialogSkills ? "360px" : "0px",
                            width: "550px",
                        }}
                        className="Id_request_dialog_div"
                    >
                        <div className="header_job">
                            <DialogTitle>
                                <h5>Add Skills </h5>
                            </DialogTitle>
                            <Button
                                className="btn_close"
                                onClick={handleCloseSkills}
                            >
                                <IoCloseCircleSharp className="close_icon" />
                            </Button>
                        </div>

                        {/* form para sa work details */}
                        <form
                            encType="multipart/form-data"
                            method="post"
                            onSubmit={changeOnClickSkills}
                            style={{ "margin-top": 15 }}
                        >
                            {/* title Name*/}
                            <div
                                className="id_input_holder"
                                style={{
                                    width: "90%",
                                    margin: "5px auto",
                                }}
                            >
                                <h5>Skill</h5>
                                <input
                                    style={{
                                        border: "1px solid gray",
                                        height: 35,
                                        fontSize: 14,
                                        padding: "1px 5px",
                                        backgroundColor: "#edf7f8",
                                    }}
                                    type="text"
                                    className="job_title"
                                    required
                                    name="jobTitle"
                                    onChange={(e) =>
                                        setSkillsTitle(e.target.value)
                                    }
                                ></input>
                            </div>

                            <div
                                className="button_save_id"
                                style={{
                                    width: "90%",
                                    display: "flex",
                                    justifyContent: "end",
                                }}
                            >
                                <button onClick={handleCloseSkills}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </Dialog>

                <h1 style={{ fontSize: "24px", color: "black" }}>
                    Resume in PDf format
                </h1>

                {userInfo && (
                    <div className="resume_ready_print">
                        <div className="header_resume">
                            <button
                                className="button_pdf"
                                onClick={generatePDF}
                            >
                                Download PDF
                            </button>
                        </div>

                        <PDFExport ref={pdfExportRef} paperSize="A4">
                            <div className="resume_body">
                                <div className="resume_left">
                                    <div className="resume_img">
                                        <img
                                            src={`http://localhost:8080/uploads/${userInfo.profilePic}`}
                                            alt="profile picture"
                                        />
                                    </div>
                                    <h1 className="personal_details_h1">
                                        Personal Details
                                    </h1>
                                    <div className="profile_info_container">
                                        <div className="profile_info_resume">
                                            <FaUserAlt className="icon_fullName" />
                                            <h1>Full Name </h1>
                                            <p>
                                                {userInfo.firstName}{" "}
                                                {userInfo.lastName}
                                            </p>
                                        </div>
                                        <div className="profile_info_resume">
                                            <AiFillHome className="icon_fullName" />
                                            <h1>Address </h1>
                                            <p>{userInfo.address}</p>
                                        </div>
                                        <div className="profile_info_resume">
                                            <BsTelephoneFill className="icon_fullName" />
                                            <h1>Phone Number </h1>{" "}
                                            <p>{userInfo.phone}</p>
                                        </div>
                                        <div className="profile_info_resume">
                                            <MdEmail className="icon_fullName" />
                                            <h1>Email </h1>{" "}
                                            <p>{userInfo.email}</p>
                                        </div>
                                    </div>
                                    <div className="skills_container">
                                        <h1>Skills</h1>

                                        {userInfo.skills &&
                                            userInfo.skills.map(
                                                (skill, index) => {
                                                    return (
                                                        <p key={index}>
                                                            {skill.title}
                                                        </p>
                                                    );
                                                }
                                            )}
                                    </div>
                                </div>
                                <div className="resume_right">
                                    <div className="about_me">
                                        <h1>About Me</h1>
                                        <p>{userInfo.bio}</p>
                                    </div>

                                    {/* work Experience */}

                                    <div className="work_experience">
                                        <h1>Work Experience</h1>
                                        {userInfo.experience &&
                                            userInfo.experience.map(
                                                (experience, index) => {
                                                    return (
                                                        <div
                                                            className="work_exp_card"
                                                            key={index}
                                                        >
                                                            <h5>
                                                                {
                                                                    experience.title
                                                                }
                                                            </h5>
                                                            <p>
                                                                {
                                                                    experience.description
                                                                }
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </div>

                                    <div className="education">
                                        <h1>Education</h1>
                                        {userInfo.education &&
                                            userInfo.education.map(
                                                (educ, index) => {
                                                    return (
                                                        <div
                                                            className="education_card"
                                                            key={index}
                                                        >
                                                            <h5>
                                                                {educ.title}
                                                            </h5>
                                                            <p>
                                                                {educ.location}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Work experience, education, and skills sections will go here */}
                        </PDFExport>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeBuilder;
