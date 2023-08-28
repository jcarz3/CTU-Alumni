import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./profile.css";
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

//images
import Snackbar from "../../components/Snackbar/Snackbar";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import JobDetails from "./JobDetails/JobDetails";

const Profile = ({ user }) => {
    const [userInfo, setUserInfo] = useState([]);
    const [userId, setUserId] = useState();

    const [newfirstName, setFirstName] = useState(userInfo.firstName);
    const [newlastName, setLastName] = useState(userInfo.lastName);
    const [newmiddleName, setMiddleName] = useState(userInfo.middleName);
    const [newbio, setBio] = useState(userInfo.bio);
    const [newaddress, setAddress] = useState(userInfo.address);
    const [newphone, setPhone] = useState(userInfo.phone);
    const [newgender, setGender] = useState(userInfo.gender);
    const [newage, setAge] = useState(userInfo.age);
    const [newcourse, setCourse] = useState(userInfo.course);
    const [newschoolYear, setSchoolYear] = useState(userInfo.schoolYear);
    const [newempstat, setEmpStat] = useState(userInfo.empStat);
    const [fileName, setFileName] = useState(userInfo.profilePic);
    const [birthday, setBirthday] = useState();

    const [message, setMessage] = useState("");
    const [awards, setAwards] = useState([]);

    // para Dialog sa Image upload
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // para state sa file sa profile picture
    const onChangeFile = (e) => {
        setFileName(e.target.files[0]);
    };

    //  formdata para update sa profile picture
    const changeOnClick = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", userInfo._id);
        formData.append("profilePic", fileName);

        axios
            .put("http://localhost:8080/api/users/updateProfilePic", formData)
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

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    //snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const SnackbarType = {
        success: "success",
        fail: "fail",
    };
    // para kuha sa usa ka data sa user
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/user/" + user)
            .then((res) => {
                setUserInfo(res.data);
                setUserId(res.data._id);
                setAwards(res.data.award);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userInfo]);

    //update call api for user details
    const updateUser = (id) => {
        const formData = new FormData();
        formData.append("profilePic", fileName);

        axios
            .put("http://localhost:8080/api/users/updateUser", {
                id: id,
                newfirstName: newfirstName,
                newlastName: newlastName,
                newmiddleName: newmiddleName,
                newbio: newbio,
                newaddress: newaddress,
                newphone: newphone,
                newgender: newgender,
                newage: newage,
                newcourse: newcourse,
                newschoolYear: newschoolYear,
                newempstat: newempstat,
                newfileName: fileName,
            })
            .then(() => {
                console.log("successs");
                setShowSnackbar(true);
                setTimeout(() => {
                    setShowSnackbar(false);
                }, 3000);
            });
    };

    // get all job details
    const [jobDetails, setJobDetails] = useState([]);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/jobDetails/jobs/${userId}`
                );
                setJobDetails(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchJobs();
    }, [jobDetails]);

    //para job details sa user
    // Dialog para job
    const [openDialogJob, setOpenDialogJob] = useState(false);
    const handleClickOpenJob = () => {
        setOpenDialogJob(true);
    };
    const handleCloseJob = () => {
        setOpenDialogJob(false);
    };

    const [jobTitle, setJobTitle] = useState();
    const [companyName, setCompanyName] = useState();
    const [companyAddress, setCompanyAddress] = useState();
    const [fileNameJob, setFileNameJob] = useState();

    const onChangeFileJob = (e) => {
        setFileNameJob(e.target.files[0]);
    };

    //sa form para job details ig submit
    const changeOnClickJob = async (e) => {
        e.preventDefault();
        const formDatas = new FormData();
        formDatas.append("id", userInfo._id);
        formDatas.append("jobTitle", jobTitle);
        formDatas.append("companyName", companyName);
        formDatas.append("companyAddress", companyAddress);
        formDatas.append("companyId", fileNameJob);
        axios
            .put(
                "http://localhost:8080/api/jobDetails/addJobDetails",
                formDatas
            )
            .then(() => {
                setShowSnackbar(true);
                setTimeout(() => {
                    setShowSnackbar(false);
                }, 3000);
            });
    };
    // para delete sa Job
    const handleDeleteJob = (jobId) => {
        axios
            .delete(
                `http://localhost:8080/api/jobDetails/deleteJob/${jobId}`,
                {}
            )
            .then((res) => {
                setJobDetails(jobDetails.filter((job) => job._id !== jobId));
            });
    };

    // =============================================================
    //para Honor and Award details sa user
    const [awardName, setAwardName] = useState();
    const [issuer, setIssuer] = useState();
    const [dateIssued, setDateIssued] = useState();
    const [awardDescription, setAwardDescription] = useState();
    // Dialog para Award
    const [openDialogAward, setOpenDialogAward] = useState(false);
    const handleClickOpenAward = () => {
        setOpenDialogAward(true);
    };
    const handleCloseAward = () => {
        setOpenDialogAward(false);
    };
    //sa form para Award details ig submit
    const changeOnClickAward = async (e) => {
        e.preventDefault();

        axios
            .put("http://localhost:8080/api/users/addAward", {
                id: userInfo._id,
                awardName: awardName,
                issuer: issuer,
                dateIssued: dateIssued,
                awardDescription: awardDescription,
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
    // para delete sa award
    const handleDeleteAward = (awardId) => {
        axios
            .put(`http://localhost:8080/api/users/deleteAward/${awardId}`, {
                userId: userId,
            })
            .then((res) => {
                setAwards(awards.filter((award) => award._id !== awardId));
            });
    };

    // para format sa date
    function formatDate(date) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
    }
    const formattedbirthday = formatDate(userInfo.birthday);

    return (
        <div className="edit_user_container">
            <ScrollToTop />
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

            <div className="edit_user_header">
                <h5>Profile</h5>
            </div>

            <div className="container">
                {/**Left */}
                <div className="profile_left">
                    <div className="profile_pic">
                        <a
                            href={`http://localhost:8080/uploads/${userInfo.profilePic}`}
                            title="Click to open Image"
                            target="_blank"
                            // style={{ height: 200, width: 120 }}
                        >
                            <img
                                src={`http://localhost:8080/uploads/${userInfo.profilePic}`}
                                alt=""
                                className="profile_pic"
                            />
                        </a>

                        {/* form  */}

                        <div className="update_img">
                            <label htmlFor="files">
                                <div className="camera_holder">
                                    <BsFillCameraFill
                                        className="camera"
                                        onClick={handleClickOpen}
                                    />
                                </div>
                            </label>

                            {/* save dialog  para sa upload pictures*/}
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                className="dialog_pic"
                                style={{ height: "400px" }}
                            >
                                <div className="header_update_pic">
                                    <DialogTitle className="dialog_title">
                                        <h5>Upload Profile Picture</h5>
                                    </DialogTitle>
                                    <Button
                                        className="btn_close"
                                        onClick={handleClose}
                                    >
                                        x
                                    </Button>
                                </div>
                                {/* form para upload og profile picture */}
                                <form
                                    onSubmit={changeOnClick}
                                    encType="multipart/form-data"
                                    method="post"
                                >
                                    <input
                                        id="files"
                                        className="input"
                                        type="file"
                                        filename="profilePic"
                                        onChange={onChangeFile}
                                    />
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
                                            onClick={handleClose}
                                        >
                                            Save
                                        </button>
                                    </div>

                                    {/* <Button onClick={handleClose} type="submit">
                                        Subscribe
                                    </Button> */}
                                </form>
                            </Dialog>
                        </div>

                        <div className="name">
                            <h5>
                                {user.firstName} {user.lastName}
                            </h5>
                        </div>
                    </div>

                    <div className="profile_about_info">
                        <h1>About Me :</h1>
                        <p>{userInfo.bio}</p>
                        <div className="fullname">
                            <h1>FullName : </h1>{" "}
                            <p>
                                {userInfo.firstName} {userInfo.middleName}{" "}
                                {userInfo.lastName}
                            </p>
                        </div>
                        <div className="fullname">
                            <h1>Student Id : </h1> <p>{userInfo.userId}</p>
                        </div>
                        <div className="fullname">
                            <h1>Address : </h1> <p>{userInfo.address}</p>
                        </div>
                        <div className="fullname">
                            <h1>Mobile : </h1> <p>{userInfo.phone}</p>
                        </div>
                        <div className="fullname">
                            <h1>Email : </h1> <p>{userInfo.email}</p>
                        </div>
                        <div className="fullname">
                            <h1>Gender : </h1> <p>{userInfo.gender}</p>
                        </div>
                        <div className="fullname">
                            <h1>Birthday : </h1> <p>{formattedbirthday}</p>
                        </div>
                        <div className="fullname">
                            <h1>Course : </h1> <p>{userInfo.course}</p>
                        </div>
                        <div className="fullname">
                            <h1>School Year : </h1> <p>{userInfo.schoolYear}</p>
                        </div>
                        <div className="fullname">
                            <h1>Employment Status : </h1>
                            <p>{userInfo.empStat}</p>
                        </div>
                    </div>

                    {/* skills details */}
                    {/* <div className="skills_header">
                        <h1 style={{ "font-size": "18px" }}>Skills Details</h1>
                        <AiOutlinePlus
                            className="icon"
                            onClick={handleClickOpenSkills}
                        />
                    </div> */}
                </div>

                {/**Right */}
                <div className="right">
                    {/* personal details input */}
                    <div className="top_profile">
                        <div className="settings">
                            <h1>Edit Your Profile</h1>
                        </div>
                        <div className="edit_personal_info">
                            <FaUserCircle className="edit_user_icons" />
                            <h1>Personal Info</h1>
                        </div>{" "}
                        <div></div>
                        {/**Full name Input */}
                        <div className="fname">
                            <div className="fname_holder">
                                <p>Last Name</p>
                                <input
                                    type="text"
                                    className="input_fname"
                                    placeholder={userInfo.lastName}
                                    defaultValue={userInfo.lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>
                            <div className="fname_holder">
                                <p>First Name</p>
                                <input
                                    type="text"
                                    className="input_fname"
                                    placeholder={userInfo.firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    defaultValue={userInfo.firstName}
                                />
                            </div>
                            <div className="fname_holder">
                                <p>Middle Name</p>
                                <input
                                    type="text"
                                    className="input_fname"
                                    placeholder={userInfo.middleName}
                                    defaultValue={userInfo.middleName}
                                    onChange={(e) =>
                                        setMiddleName(e.target.value)
                                    }
                                />
                            </div>

                            {/* about me */}
                            <div className="bio">
                                <p>About Me</p>
                                <textarea
                                    type="text"
                                    className="bio_area"
                                    defaultValue={userInfo.bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>
                            {/* address */}
                            <div className="phone_holder">
                                <p>Address</p>
                                <input
                                    type="text"
                                    className="input_fname"
                                    defaultValue={userInfo.address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="phone_holder">
                                <p>Phone</p>
                                <input
                                    type="text"
                                    className="input_fname"
                                    defaultValue={userInfo.phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="gender_holder">
                                <p>Gender</p>
                                <select
                                    defaultValue={user.gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="selectGender"
                                >
                                    <option value="">--Select--</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="age_holder">
                                <p>Age</p>
                                <input
                                    type="text"
                                    className="input_fname"
                                    defaultValue={userInfo.age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>

                            <div className="course_holder">
                                <p>Course</p>
                                <select
                                    defaultValue={user.course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="selectCourse"
                                >
                                    <option value="">--Select--</option>
                                    <option value="BAL">
                                        Bachelor of Arts In Literature
                                    </option>
                                    <option value="BAEL">
                                        Bachelor of Arts in English Languange
                                    </option>
                                    <option value="BTLED">
                                        Bachelor of Techology and Livelihood
                                        Education
                                    </option>
                                    <option value="BSED">
                                        Bachelor of Secondary Education
                                    </option>
                                    <option value="BEED">
                                        Bachelor of Elementary Education
                                    </option>
                                    <option value="BSIE">
                                        Bachelor of Science in Industrial
                                        Engineering
                                    </option>
                                    <option value="BSIT">
                                        Bachelor of Science in Information
                                        Technology
                                    </option>
                                    <option value="BIT-G">BIT Garments</option>
                                    <option value="BIT-D">BIT Drafting</option>
                                    <option value="BIT-CT">
                                        BIT Computer Technology
                                    </option>
                                    <option value="BIT-A">
                                        BIT Automotive
                                    </option>
                                    <option value="BIT-E">
                                        BIT Electronics
                                    </option>

                                    <option value="BSA">
                                        Bachelor of Science in Agriculture
                                    </option>
                                    <option value="BSHM">
                                        Bachelor of Science in Hospitality
                                        Management
                                    </option>
                                </select>
                            </div>

                            <div className="year_holder">
                                <p>School Year</p>
                                <input
                                    type="text"
                                    className="input_fname"
                                    defaultValue={userInfo.schoolYear}
                                    onChange={(e) =>
                                        setSchoolYear(e.target.value)
                                    }
                                />
                            </div>

                            <div className="status_holder">
                                <p>Employment Status :</p>
                                <select
                                    defaultValue={userInfo.empStat}
                                    onChange={(e) => setEmpStat(e.target.value)}
                                >
                                    <option value="">--Select--</option>
                                    <option value="Unemployed">
                                        Unemployed
                                    </option>
                                    <option value="Employed">Employed</option>
                                    <option value="UnderEmployed">
                                        UnderEmployed
                                    </option>
                                    <option value="Self-Employed">
                                        Self-Employed
                                    </option>
                                </select>
                            </div>
                        </div>
                        {/* save button */}
                        <div className="button_holder">
                            <button
                                className="button"
                                onClick={() => {
                                    updateUser(userInfo._id);
                                }}
                            >
                                <FaSave className="icon" />
                                <p>Save</p>
                            </button>
                        </div>
                    </div>

                    {/* job details container*/}
                    <div className="job_profile_section">
                        <div className="jps_header">
                            <h1>Job Details</h1>
                            <AiOutlinePlus
                                className="icon"
                                onClick={handleClickOpenJob}
                            />
                        </div>

                        <div className="job_profile_section_body">
                            {/* Job details Map */}
                            {jobDetails.map((jobDetail) => (
                                <div
                                    key={jobDetail._id}
                                    className="jobDetails_card"
                                >
                                    <h5>
                                        {"Job Title: "}
                                        {jobDetail.title}
                                    </h5>
                                    <p style={{ "margin-bottom": 0 }}>
                                        {"Compay Name: "}
                                        {jobDetail.companyName}
                                    </p>
                                    <p style={{ "margin-bottom": 0 }}>
                                        {"Company Address: "}
                                        {jobDetail.companyAddress}
                                    </p>
                                    {jobDetail.companyId === "N/A" ? null : (
                                        <a
                                            href={`http://localhost:8080/companyId/${jobDetail.companyId}`}
                                            title="Click to open Image"
                                            target="_blank"
                                            download
                                            // style={{ height: 200, width: 120 }}
                                        >
                                            Company Id
                                        </a>
                                    )}
                                    <button
                                        onClick={() =>
                                            handleDeleteJob(jobDetail._id)
                                        }
                                    >
                                        <BsTrash className="icon" />
                                        <p>Delete</p>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* dialog para add og job details sa User */}
                    <Dialog
                        className="job_details_dialog"
                        open={openDialogJob}
                        onClose={handleCloseJob}
                    >
                        <motion.div
                            animate={{
                                height: openDialogJob ? "410px" : "0px",
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
                                    onClick={handleCloseJob}
                                >
                                    <IoCloseCircleSharp className="close_icon" />
                                </Button>
                            </div>

                            {/* form para sa Job Details */}
                            <form
                                encType="multipart/form-data"
                                method="post"
                                // onSubmit={(event) => {
                                //     changeOnClickJob(userInfo._id, event);
                                // }}

                                onSubmit={changeOnClickJob}
                                style={{ "margin-top": 15 }}
                            >
                                {/* Job Title */}
                                <div
                                    className="id_input_holder"
                                    style={{
                                        width: "90%",
                                        margin: "5px auto",
                                    }}
                                >
                                    <h5>Job Title</h5>
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
                                        placeholder="Ex. Carpenter"
                                        name="jobTitle"
                                        onChange={(e) =>
                                            setJobTitle(e.target.value)
                                        }
                                    ></input>
                                </div>

                                {/* Company Name */}
                                <div
                                    className="id_input_holder"
                                    style={{
                                        width: "90%",
                                        margin: "5px auto",
                                    }}
                                >
                                    <h5>Company Name</h5>
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
                                        name="companyName"
                                        onChange={(e) =>
                                            setCompanyName(e.target.value)
                                        }
                                        // onChange={(e) => setEmail(e.target.value)}
                                    ></input>
                                </div>

                                {/* Company Address */}
                                <div
                                    className="id_input_holder"
                                    style={{
                                        width: "90%",
                                        margin: "5px auto",
                                    }}
                                >
                                    <h5>Company Address</h5>
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
                                        name="companyAddress"
                                        onChange={(e) =>
                                            setCompanyAddress(e.target.value)
                                        }
                                        // onChange={(e) => setEmail(e.target.value)}
                                    ></input>
                                </div>

                                {/* Company ID */}
                                <div
                                    className="id_input_holder"
                                    style={{
                                        width: "90%",
                                        margin: "5px auto",
                                    }}
                                >
                                    <h5>Company Id</h5>
                                    <input
                                        style={{
                                            border: "1px solid gray",
                                            height: 35,
                                            fontSize: 14,
                                            padding: "5px 5px",
                                            backgroundColor: "#edf7f8",
                                        }}
                                        type="file"
                                        name="companyId"
                                        onChange={onChangeFileJob}
                                        // onChange={(e) => setEmail(e.target.value)}
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
                                    <button
                                        style={{ border: "1px solid green" }}
                                        onClick={handleCloseJob}
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </Dialog>

                    {/* Award details container */}
                    <div className="job_profile_section">
                        <div className="jps_header">
                            <h1>Honor & Awards</h1>
                            <AiOutlinePlus
                                className="icon"
                                onClick={handleClickOpenAward}
                            />
                        </div>

                        <div className="job_profile_section_body">
                            {/* Awards details .map */}
                            {awards &&
                                awards.map((award, index) => {
                                    const formattedDate = formatDate(
                                        award.dateIssued
                                    );
                                    return (
                                        <div key={index} className="award_card">
                                            <h5 style={{ fontWeight: "600" }}>
                                                {award.awardName} -{" "}
                                                {award.issuer}
                                            </h5>
                                            <p
                                                style={{
                                                    "margin-bottom": 0,
                                                }}
                                            >
                                                {formattedDate}
                                            </p>
                                            <p style={{ "margin-bottom": 0 }}>
                                                {award.description}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    handleDeleteAward(award._id)
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
                    {/* dialog para add og Honor and Awards details sa User */}
                    <Dialog
                        className="job_details_dialog"
                        open={openDialogAward}
                        onClose={handleCloseAward}
                    >
                        <motion.div
                            animate={{
                                height: openDialogAward ? "410px" : "0px",
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
                                    onClick={handleCloseAward}
                                >
                                    <IoCloseCircleSharp className="close_icon" />
                                </Button>
                            </div>

                            {/* form para sa Job Details */}
                            <form
                                encType="multipart/form-data"
                                method="post"
                                onSubmit={changeOnClickAward}
                                style={{ "margin-top": 15 }}
                            >
                                {/* Award Name*/}
                                <div
                                    className="id_input_holder"
                                    style={{
                                        width: "90%",
                                        margin: "5px auto",
                                    }}
                                >
                                    <h5>Name</h5>
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
                                        placeholder="Ex. Employee of the Year"
                                        name="jobTitle"
                                        onChange={(e) =>
                                            setAwardName(e.target.value)
                                        }
                                    ></input>
                                </div>

                                {/* Issuer*/}
                                <div
                                    className="id_input_holder"
                                    style={{
                                        width: "90%",
                                        margin: "5px auto",
                                    }}
                                >
                                    <h5>Issuer</h5>
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
                                            setIssuer(e.target.value)
                                        }
                                    ></input>
                                </div>

                                {/* Date issued */}
                                <div
                                    className="id_input_holder"
                                    style={{
                                        width: "90%",
                                        margin: "5px auto",
                                    }}
                                >
                                    <h5>Date Issued</h5>
                                    <input
                                        style={{
                                            border: "1px solid gray",
                                            height: 35,
                                            fontSize: 14,
                                            padding: "1px 5px",
                                            backgroundColor: "#edf7f8",
                                        }}
                                        type="date"
                                        className="job_title"
                                        required
                                        name="dateIssued"
                                        onChange={(e) =>
                                            setDateIssued(e.target.value)
                                        }
                                        // onChange={(e) => setEmail(e.target.value)}
                                    ></input>
                                </div>

                                {/* Award Description */}
                                <div
                                    className="id_input_holder"
                                    style={{
                                        width: "90%",
                                        margin: "5px auto",
                                    }}
                                >
                                    <h5>Description</h5>
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
                                        name="awardDescription"
                                        onChange={(e) =>
                                            setAwardDescription(e.target.value)
                                        }
                                        // onChange={(e) => setEmail(e.target.value)}
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
                                    <button onClick={handleCloseAward}>
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </Dialog>

                    {/* all job details of a single USer */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
