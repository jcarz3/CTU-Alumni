import "./main.css";
import React from "react";

import { motion } from "framer-motion";

import axios from "axios";
import { format } from "timeago.js";
import { useParams } from "react-router-dom";

//para dialog
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

//icons
import { FaBars, FaUser } from "react-icons/fa";
import { FaRegWindowClose } from "react-icons/fa";
import {
    AiOutlineLogout,
    AiOutlineHome,
    AiOutlineUserAdd,
    AiOutlineUsergroupAdd,
    AiFillFilePpt,
    AiFillFilePdf,
} from "react-icons/ai";
import { VscCalendar } from "react-icons/vsc";
import { IoMdNotifications, IoMdNotificationsOutline } from "react-icons/io";
import { FiMoon } from "react-icons/fi";
import { BsFilePerson, BsPersonSquare, BsSun } from "react-icons/bs";
import { BiUser, BiFile, BiUserVoice } from "react-icons/bi";
import { TbListDetails } from "react-icons/tb";

import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import Snackbar from "../../components/Snackbar/Snackbar";

//images
import ctu from "../../images/ctu.png";
import { IoCloseCircleSharp, IoCloseSharp } from "react-icons/io5";
// import Snackbar from "../Snackbar/Snackbar";

const Main = ({ children, theme, toggleTheme, user }) => {
    //para events
    const [data, setData] = useState([]);

    //snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const SnackbarType = {
        success: "success",
        fail: "fail",
    };

    ///para ig click ma mark as read na ang notif
    const [clicked, setClicked] = useState(false);

    // fetch the current URL
    const currentUrl = window.location.href;

    //split the url
    const parts = currentUrl.split("/");

    //get only the 5th part of the url
    const idNotification = parts[4];

    //logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        setTimeout(() => {
            window.location = "/login";
        }, 1000);
    };

    // let count = 0;
    // userInfo.notification.map((data) => {
    //     if (data.read === false) {
    //         count++;
    //     }
    // });
    // para kuha sa usa ka data sa user
    // const count = userInfo.reduce((acc, user) => {
    //     return (
    //         acc +
    //         user.notification.filter(
    //             (notification) => notification.read === false
    //         ).length
    //     );
    // }, 0);

    // para count sa notifications nga wa pa na read
    const [count, setCount] = useState(0);
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/countUnreadEvents/" + user)
            .then((res) => {
                setCount(res.data);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [count]);

    //para kuha sa User info sa usa
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

    //fetch all events para ibutang sa notification
    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/events/all/${user}`)
            .then((res) => {
                setData(res.data);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [data]);

    // Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const handleClickOpen = () => {
        setOpenDialog(true);
    };
    const handleClose = () => {
        setOpenDialog(false);
    };
    // para request og alumni id
    const [email, setEmail] = useState();
    const handleSubmit = () => {
        axios.post("http://localhost:8080/api/requests/addRequest", {
            email: email,
            ownerId: userInfo._id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
        });
        handleClose();
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };
    const changeRead = (id, notificationID) => {
        axios.put("http://localhost:8080/api/users/changeRead/" + id, {
            notificationId: notificationID,
        });
    };

    // para funtionalities sa button
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

    // para sa jobs na navigation
    const [opens, setOpens] = useState(false);
    const toggle_arrows = () => setOpens(!opens);

    const [openRightBar, setOpenRightBar] = useState(false);
    const toggleRightBar = () => {
        setOpenRightBar(!openRightBar);
        setNotification(false);
    };
    const [openNotification, setNotification] = useState(false);
    const toggleNotification = () => setNotification(!openNotification);

    return (
        <div className="main_container">
            {/* snackbar notif */}
            <div
                className="snackbar_position"
                id={showSnackbar ? "show" : "hide"}
            >
                <Snackbar
                    message={"Request Successfully"}
                    type={SnackbarType.success}
                />
            </div>
            <div className="blur" style={{ top: "-18%", right: "0" }}></div>
            <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>

            {/*Icons sa left side */}
            <div className="left_icons">
                <div className="bars">
                    <FaBars className="fa_bars" onClick={toggle} />
                    {/* <FaBars onClick={toggleSnackbar} /> */}
                </div>
                <NavLink
                    exact={true}
                    to="/home"
                    key="Home"
                    className={({ isActive }) =>
                        isActive ? "sidebar_active" : "sidebar_icon"
                    }
                >
                    <div className="icon">{<AiOutlineHome />}</div>
                </NavLink>
                <NavLink
                    exact={true}
                    to={"/userlist"}
                    key={"UserList"}
                    className={({ isActive }) =>
                        isActive ? "sidebar_active" : "sidebar_icon"
                    }
                >
                    <div className="icon">{<BiUser />}</div>
                </NavLink>
                <NavLink
                    exact={true}
                    to={"/jobposting"}
                    key={"JobPosting"}
                    className={({ isActive }) =>
                        isActive ? "sidebar_active" : "sidebar_icon"
                    }
                >
                    <div className="icon">{<BiFile />}</div>
                </NavLink>

                {/* add alumni nav icon */}
                {userInfo.isAdmin && (
                    <NavLink
                        exact={true}
                        to={"/addalumni"}
                        key={"AddAlumni"}
                        className={({ isActive }) =>
                            isActive ? "sidebar_active" : "sidebar_icon"
                        }
                    >
                        <div className="icon">{<AiOutlineUsergroupAdd />}</div>
                    </NavLink>
                )}

                {/* events nav button */}
                <NavLink
                    exact={true}
                    to={"/events"}
                    key={"Events"}
                    className={({ isActive }) =>
                        isActive ? "sidebar_active" : "sidebar_icon"
                    }
                >
                    <div className="icon">{<VscCalendar />}</div>
                </NavLink>

                {userInfo.isAdmin && (
                    <NavLink
                        exact={true}
                        to={"/requestId"}
                        key={"RequestId"}
                        className={({ isActive }) =>
                            isActive ? "sidebar_active" : "sidebar_icon"
                        }
                    >
                        <div className="icon">{<BiUserVoice />}</div>
                    </NavLink>
                )}
            </div>

            {/*SideBar Links */}
            <motion.div
                animate={{ width: isOpen ? "170px" : "0px" }}
                className="sidebar"
            >
                {/* Sidebar CTU header*/}
                {isOpen && (
                    <div className="top_section">
                        {isOpen && <h1 className="logo">CTU AC</h1>}
                        {isOpen && (
                            <div className="logo_container">
                                <img src={ctu} alt="" className="logo_ctu" />
                            </div>
                        )}
                    </div>
                )}
                {isOpen && (
                    <section className="routes">
                        {/* Home Button Menu*/}
                        <div className="link_holder">
                            <NavLink
                                exact={true}
                                to={"/home"}
                                key={"Home"}
                                className={({ isActive }) =>
                                    isActive ? "active" : "link"
                                }
                            >
                                {isOpen && (
                                    <div className="link_text">
                                        {"Dashboard"}
                                    </div>
                                )}
                            </NavLink>
                        </div>

                        {/* Alumni Button Menu*/}
                        <div className="link_holder">
                            <div className="link_container">
                                <NavLink
                                    exact={true}
                                    to={"/userlist"}
                                    key={"UserList"}
                                    className={({ isActive }) =>
                                        isActive ? "active" : "link"
                                    }
                                >
                                    {isOpen && (
                                        <div className="link_text">
                                            {"Alumni"}
                                        </div>
                                    )}

                                    {/* Arrow Button*/}
                                </NavLink>
                                {/* <div className="arrow_icon_holder">
                                    <div className="arrow_icon">
                                        {
                                            <MdOutlineKeyboardArrowRight
                                                className={`toggle_btn ${
                                                    open ? "rotate" : ""
                                                }`}
                                                onClick={toggle_arrow}
                                                id="toggle_btn"
                                            />
                                        }
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        {/* Job  */}
                        <div className="link_holder">
                            <div className="link_container">
                                <NavLink
                                    exact={true}
                                    to={"/jobposting"}
                                    key={"JobPosting"}
                                    className={({ isActive }) =>
                                        isActive ? "active" : "link"
                                    }
                                >
                                    {isOpen && (
                                        <div className="link_text">
                                            {"Job Post"}
                                        </div>
                                    )}

                                    {/* Arrow Button*/}
                                </NavLink>
                            </div>
                        </div>

                        {/* Alumni Button Menu*/}
                        {userInfo.isAdmin && (
                            <div className="link_holder">
                                <div className="link_container">
                                    <NavLink
                                        exact={true}
                                        to={"/addalumni"}
                                        key={"AddAlumni"}
                                        className={({ isActive }) =>
                                            isActive ? "active" : "link"
                                        }
                                    >
                                        {isOpen && (
                                            <div className="link_text">
                                                {"Add Alumni"}
                                            </div>
                                        )}

                                        {/* Arrow Button*/}
                                    </NavLink>
                                </div>
                            </div>
                        )}

                        {/* Events Button Menu*/}
                        <div className="link_holder">
                            <div className="link_container">
                                <NavLink
                                    exact={true}
                                    to={"/events"}
                                    key={"Events"}
                                    className={({ isActive }) =>
                                        isActive ? "active" : "link"
                                    }
                                >
                                    {isOpen && (
                                        <div className="link_text">
                                            {"Events"}
                                        </div>
                                    )}

                                    {/* Arrow Button*/}
                                </NavLink>
                            </div>

                            {/* Submenu*/}
                            {/* <div
                                className={({ open }) =>
                                    open ? "submenu_open" : "submenu"
                                }
                            >
                                <NavLink
                                    exact={true}
                                    to={"/userlist"}
                                    key={"UserList"}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "active_sub_link"
                                            : "sub_link"
                                    }
                                >
                                    {open && (
                                        <div className="link_text_submenu">
                                            {"User List"}
                                        </div>
                                    )}
                                </NavLink>
                            </div> */}
                        </div>

                        {/* Requested ID Button Menu*/}
                        {userInfo.isAdmin && (
                            <div className="link_holder">
                                <div className="link_container">
                                    <NavLink
                                        exact={true}
                                        to={"/requestId"}
                                        key={"RequestId"}
                                        className={({ isActive }) =>
                                            isActive ? "active" : "link"
                                        }
                                    >
                                        {isOpen && (
                                            <div className="link_text">
                                                {"Requested ID"}
                                            </div>
                                        )}

                                        {/* Arrow Button*/}
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </motion.div>
            {/*Right container  */}
            <div className="right_container">
                {/*Navbar og title bar sa taas */}
                <div className="navbar_container">
                    <nav className="navbar">
                        <h1 className="alumni">Alumni Information System</h1>

                        {/* night mode and dark mode */}
                        <div className="right_theme" onClick={toggleTheme}>
                            {theme === "light" ? (
                                <FiMoon className="moon" title="Dark Mode" />
                            ) : (
                                <BsSun className="sun" title="Light Mode" />
                            )}
                        </div>

                        {/* notifications */}
                        <div
                            className="topBarIconContainer"
                            onClick={toggleNotification}
                        >
                            {openNotification ? (
                                <IoMdNotificationsOutline className="iconBlue" />
                            ) : (
                                <IoMdNotificationsOutline className="icon" />
                            )}
                            {/* <span className="topIconBadge">{count}</span> */}
                            {count.count > 0 ? (
                                <span className="topIconBadge">
                                    {count.count}
                                </span>
                            ) : null}
                        </div>

                        {/* dropdown para notificacion */}
                        <motion.div
                            animate={{
                                height: openNotification ? "570px" : "0",
                            }}
                            className="notificationContainer"
                        >
                            <div className="inner_notif_dialog">
                                {openNotification && (
                                    <h1 className="h1">Events Notifications</h1>
                                )}

                                {openNotification &&
                                    userInfo.notification
                                        .map((val, key) => {
                                            return (
                                                <Link
                                                    key={val.notificationId}
                                                    to={
                                                        "/event/" +
                                                        val.notificationId
                                                    }
                                                    className="event_cards_notif"
                                                    title="Click me"
                                                    onClick={() => {
                                                        changeRead(
                                                            userInfo._id,
                                                            val.notificationId
                                                        );
                                                    }}
                                                >
                                                    <h5>{val.title}</h5>
                                                    {}
                                                    <p>
                                                        {val.description.substring(
                                                            0,
                                                            60
                                                        )}
                                                        {"..."}
                                                    </p>
                                                    <div className="para_time">
                                                        <p>
                                                            {format(val.date)}
                                                        </p>
                                                        {val.read === false ? (
                                                            <p className="unRead">
                                                                Unread
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </Link>
                                            );
                                        })
                                        .sort()
                                        .reverse()}
                            </div>
                        </motion.div>

                        {/* dropdown para profile */}
                        <motion.div
                            animate={{
                                height: openRightBar ? "400px" : "0",
                            }}
                            className="Username"
                        >
                            <div className="Username_logo">
                                <div className="right_bar">
                                    <div
                                        onClick={toggleRightBar}
                                        className="right_bars"
                                    >
                                        {openRightBar ? (
                                            <FaRegWindowClose className="right_bars" />
                                        ) : (
                                            // <FaBars className="right_bars" />
                                            <div className="profile_pics">
                                                <img
                                                    id="profile_img_main"
                                                    src={`http://localhost:8080/uploads/${userInfo.profilePic}`}
                                                    alt=""
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* <FaBars
                                        onClick={toggleRightBar}
                                        className="right_bars"
                                    /> */}
                                </div>
                                <div className="right_Menu">
                                    <div className="profile_picss">
                                        <img
                                            id="profile_img_main"
                                            src={`http://localhost:8080/uploads/${userInfo.profilePic}`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="side_profile">
                                        <h5>
                                            {userInfo.firstName}{" "}
                                            {userInfo.lastName}
                                        </h5>
                                        {!userInfo.isAdmin ? (
                                            <p>Alumni</p>
                                        ) : (
                                            <p>Administrator</p>
                                        )}
                                    </div>
                                </div>
                                <hr className="horizontal_line" />

                                <div className="right_link_holder">
                                    <NavLink
                                        exact={true}
                                        to={"/profile"}
                                        key={"Profile"}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "right_link_active"
                                                : "right_link"
                                        }
                                    >
                                        <div className="icons">
                                            {<FaUser />}
                                        </div>

                                        <div className="right_link_text">
                                            {"Profile"}
                                        </div>
                                    </NavLink>
                                </div>

                                {/* resume builder */}
                                <div className="right_link_holder">
                                    <NavLink
                                        exact={true}
                                        to={"/resumeBuilder"}
                                        key={"ResumeBuilder"}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "right_link_active"
                                                : "right_link"
                                        }
                                    >
                                        <div className="icons">
                                            {<AiFillFilePdf />}
                                        </div>

                                        <div className="right_link_text">
                                            {"Build a resume"}
                                        </div>
                                    </NavLink>
                                </div>

                                {/* Request Id nav  */}
                                <div className="right_link_holder">
                                    <div className="button_request_id">
                                        <button
                                            className="requestId"
                                            title="button"
                                            onClick={handleClickOpen}
                                        >
                                            <BsPersonSquare className="icon" />
                                            <p>Request Alumni Id</p>
                                        </button>
                                    </div>
                                </div>

                                {/* logout */}
                                <div className="right_link_holder">
                                    <NavLink
                                        exact={true}
                                        to={"/"}
                                        key={"Login"}
                                        className="right_link"
                                    >
                                        <div className="icons">
                                            {<AiOutlineLogout />}
                                        </div>
                                        <div
                                            className="right_link_text"
                                            onClick={handleLogout}
                                        >
                                            {"Logout"}
                                        </div>
                                    </NavLink>
                                </div>
                            </div>
                        </motion.div>
                    </nav>
                </div>

                {/* Dialog para request og ID */}
                <Dialog
                    className="Id_request_dialog"
                    open={openDialog}
                    onClose={handleClose}
                >
                    <motion.div
                        animate={{
                            height: openDialog ? "260px" : "0px",
                            width: "450px",
                        }}
                        className="Id_request_dialog_div"
                    >
                        <div className="header_job">
                            <DialogTitle>
                                <h5>Would you like to request an Alumni ID?</h5>
                            </DialogTitle>
                            <Button className="btn_close" onClick={handleClose}>
                                <IoCloseCircleSharp className="close_icon" />
                            </Button>
                        </div>

                        <div className="id_input_holder">
                            <h5>Email</h5>
                            <input
                                style={{ border: "1px solid gray" }}
                                name="job_title"
                                type="email"
                                className="job_title"
                                required
                                placeholder="Enter a valid email address"
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                        </div>

                        <div className="button_save_id">
                            <button
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Yes Please
                            </button>
                        </div>
                    </motion.div>
                </Dialog>
                {/*Container para sa mga Router link */}
                <main className="side_container">{children}</main>
            </div>
        </div>
    );
};

export default Main;
