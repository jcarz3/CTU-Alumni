import React from "react";
import { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";

import dash from "../../images/dash.png";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import BarChartExample from "./BarChartEample";
import SchoolYearChart from "./SchoolYearChart";
import GenderChart from "./GenderChart";

//icons
import { MdEmojiEvents, MdOutlineWork } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import AddressChart from "./AddressChart";

const Home = ({ theme, user }) => {
    const [open, setOpen] = useState(false);
    const [quotes, setQuotes] = useState(false);

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

    //fetch random qoutes online
    useEffect(() => {
        try {
            axios
                .get("https://dummyjson.com/quotes/random")
                .then((response) => {
                    setQuotes(response.data.quote);
                });
        } catch (error) {
            console.log(error);
        }
    }, []);

    // count para sa total of jobs events and idrequest
    const [eventCount, setEventCount] = useState(0);
    const [jobCount, setJobsCount] = useState(0);
    const [idRequestCount, setIdRequestCount] = useState(0);
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/jobs/getCount")
            .then((res) => {
                setEventCount(res.data.eventCount);
                setJobsCount(res.data.jobCount);
                setIdRequestCount(res.data.idRequestCount);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // para count emp status
    const [empStatCount, setEmpStatCount] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/countEmploymentStatus")
            .then((res) => {
                setEmpStatCount(res.data); // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log("empstat nabuang", err);
            });
    }, [empStatCount]);

    // para awards
    const [userAwards, setUserAwards] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/usersWithAward")
            .then((res) => setUserAwards(res.data))
            .catch((err) => console.log(err));
    }, [userAwards]);

    return (
        <div className="main_containers">
            <ScrollToTop />
            <div className="home_bar">
                <h5 className="h5">Home</h5>
            </div>

            {/* first div container */}
            <div className="first_div">
                <div className="first_div_left">
                    <img src={dash} alt="" />
                    <div className="first_div_title">
                        <h1>Welcome Back {userInfo && userInfo.firstName} !</h1>{" "}
                        <p>{quotes}</p>
                    </div>
                </div>
                {/* first div right container */}
                <div className="first_div_right">
                    {/* <div className="employment_content">
                            <div className="employment_content_one">
                                <AiTwotoneRightCircle className="icon" />
                                <p>Employed</p>
                            </div>

                            <div className="employment_content_two">
                                <AiTwotoneRightCircle className="icon" />
                                <p>Self Employed</p>
                            </div>
                            <div className="employment_content_three">
                                <AiTwotoneRightCircle className="icon" />
                                <p>Under Employed</p>
                            </div>
                            <div className="employment_content_four">
                                <AiTwotoneRightCircle className="icon" />
                                <p>UnEmployed</p>
                            </div>
                        </div>
                        <img src={employment} alt="" /> */}

                    <h5
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "15px",
                            "margin-top": "10px",
                            "margin-right": "5px",

                            "margin-bottom": "8px",
                        }}
                    >
                        Course Distribution
                    </h5>
                    <BarChartExample />
                    {/* </div> */}
                </div>
            </div>

            {/* second div container */}
            <div className="second_div">
                {empStatCount.map((value, key) => {
                    return (
                        <>
                            <div className="second_div_content">
                                <h1>{value.employed}</h1>
                                <p>Employed</p>
                            </div>
                            <div className="second_div_content">
                                <h1>{value.underemployed}</h1>
                                <p>Under Employed</p>
                            </div>
                            <div className="second_div_content">
                                <h1>{value.unEmployed}</h1>
                                <p>UnEmployed</p>
                            </div>
                            <div className="second_div_content">
                                <h1>{value.selfEmployed}</h1>
                                <p>Self Employed</p>
                            </div>
                            <div className="second_div_content">
                                <h1>{value.totalAlumni}</h1>
                                <p>Total Active Alumni</p>
                            </div>
                        </>
                    );
                })}
            </div>

            {/* third div container */}
            <div className="third_div">
                <div className="third_div_content">
                    <h5
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "15px",
                            "margin-top": "10px",
                            "margin-right": "5px",
                            "margin-bottom": "8px",
                        }}
                    >
                        Number of Alumni by Year
                    </h5>
                    <SchoolYearChart />
                    {/* light and dark para chart */}
                    {/* {theme === "light" ? (
                        <iframe className="alumniChart" src={lightSrc}></iframe>
                    ) : (
                        <iframe className="alumniChart" src={darkSrc}></iframe>
                    )} */}
                </div>

                <div className="third_div_content">
                    <h5
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "15px",
                            "margin-top": "10px",
                        }}
                    >
                        Gender Distribution
                    </h5>
                    <GenderChart />
                </div>
                <div className="third_div_content">
                    <NavLink
                        exact={true}
                        to={"/jobposting"}
                        key={"JobPosting"}
                        className="total_job"
                    >
                        <div className="logo_container">
                            <MdOutlineWork className="icon" />
                        </div>
                        <div className="contents">
                            <h5 style={{ "margin-bottom": "2px" }}>
                                Number of Jobs Posted
                            </h5>

                            <h1>{jobCount}</h1>
                        </div>
                    </NavLink>
                    <NavLink
                        exact={true}
                        to={"/events"}
                        key={"Events"}
                        className="total_events"
                    >
                        <div className="logo_container">
                            <MdEmojiEvents className="icon" />
                        </div>
                        <div className="contents">
                            <h5 style={{ margin: "0" }}>Number of Events </h5>
                            <h1>{eventCount}</h1>
                        </div>
                    </NavLink>
                    <NavLink
                        exact={true}
                        to={"/requestId"}
                        key={"RequestId"}
                        className="total_idRequest"
                    >
                        <div className="logo_container">
                            <FaUserCircle className="icon" />
                        </div>
                        <div className="contents">
                            <h5 style={{ "margin-bottom": "2px" }}>
                                Number of Id Request
                            </h5>
                            <h1>{idRequestCount}</h1>
                        </div>
                    </NavLink>
                </div>
            </div>

            {/* third div container */}
            <div className="fourth_div">
                <div className="fourth_div_content">
                    {/* user awards chart */}
                    <h4 style={{ "margin-bottom": "1px" }}>Awards</h4>
                    {userAwards
                        .map((user) => (
                            <Link
                                key={user._id}
                                to={"/user/" + user._id}
                                className="fourth_div_link"
                            >
                                <img
                                    src={`http://localhost:8080/uploads/${user.profilePic}`}
                                    alt="picture"
                                />
                                <div className="header">
                                    <h5>
                                        {user.firstName} {user.lastName}
                                    </h5>
                                    {/* {user.award.map((awd) => (
                                    <div>
                                        <p style={{ "margin-bottom": "2px" }}>
                                            {awd.awardName}
                                        </p>
                                    </div>
                                ))} */}
                                    <h4 style={{ margin: 0 }}>
                                        {user.award.awardName}
                                    </h4>
                                    <p>{user.award.issuer}</p>
                                </div>
                                <button>View</button>
                            </Link>
                        ))
                        .sort()
                        .reverse()}
                </div>

                {/* address chart */}
                <div className="fourth_div_content">
                    <h5
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "15px",
                            "margin-top": "10px",
                            "margin-right": "5px",
                            "margin-bottom": "8px",
                        }}
                    >
                        Address Frequency among Users
                    </h5>
                    <AddressChart />
                </div>
            </div>
        </div>
    );
};

export default Home;
