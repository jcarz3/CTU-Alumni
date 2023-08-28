import React from "react";
import { useState, useRef, useEffect } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import "./resume.css";

import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

import madara from "../../images/jennie.png";
const Resume = ({ user }) => {
    // Declare state variables to store the resume data
    const [info, setInfo] = useState([]);
    const [personalInfo, setPersonalInfo] = useState([]);
    const [aboutMe, setAboutMe] = useState("");
    const [workExperience, setWorkExperience] = useState([
        { title: "", description: "" },
    ]);
    const [education, setEducation] = useState([{ title: "", location: "" }]);
    const [skills, setSkills] = useState([]);

    const pdfExportRef = useRef();
    // Function to handle changes to the personal info form
    function handlePersonalInfoChange(event) {
        const { name, value } = event.target;
        setPersonalInfo({ ...personalInfo, [name]: value });
    }

    // Functions to handle changes to the work experience, education, and skills sections
    // These will likely involve adding and removing items from arrays, similar to the personal info form
    // ...

    // Function to generate the PDF

    function generatePDF() {
        pdfExportRef.current.save();
    }

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/users/user/" + user)
            .then((res) => {
                console.log(res.data);
                setPersonalInfo(res.data);

                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [personalInfo]);

    // Render the resume builder form
    return (
        <div className="resume_container">
            <div className="header_resume">
                <button className="button_pdf" onClick={generatePDF}>
                    Download PDF
                </button>
            </div>

            <PDFExport ref={pdfExportRef} paperSize="A4">
                <div className="resume_body">
                    <div className="resume_left">
                        <div className="resume_img">
                            <img src={madara} alt="" />
                        </div>
                        <h1 className="personal_details_h1">
                            Personal Details
                        </h1>
                        <div className="profile_info_container">
                            <div className="profile_info_resume">
                                <FaUserAlt className="icon_fullName" />
                                <h1>Full Name </h1>
                                <p>
                                    {personalInfo.firstName}{" "}
                                    {personalInfo.lastName}
                                </p>
                            </div>
                            <div className="profile_info_resume">
                                <AiFillHome className="icon_fullName" />
                                <h1>Address </h1>
                                <p>Seoul South Korea</p>
                            </div>
                            <div className="profile_info_resume">
                                <BsTelephoneFill className="icon_fullName" />
                                <h1>Phone Number </h1> <p>09273533239</p>
                            </div>
                            <div className="profile_info_resume">
                                <MdEmail className="icon_fullName" />
                                <h1>Email </h1> <p>jennie.kim@ctu.edu.ph</p>
                            </div>
                        </div>
                        <div className="skills_container">
                            <h1>Skills</h1>
                            <p>Programming</p>
                            <p>Driving</p>
                            <p>Swimming</p>
                        </div>
                    </div>
                    <div className="resume_right">
                        <div className="about_me">
                            <h1>About Me</h1>
                            <p>
                                “I'm an experienced software engineer who
                                constantly seeks out innovative solutions to
                                everyday problems. In my seven years in this
                                industry, I've honed my analytical thinking and
                                collaboration skills, and I love working with a
                                team. I've also had the opportunity to serve as
                                the software engineer lead for three projects
                                with First Technology.
                            </p>
                        </div>

                        {/* work Experience */}
                        <div className="work_experience">
                            <h1>Work Experience</h1>
                            <div className="work_exp_card">
                                <h5>Cook</h5>
                                <p>
                                    Extensive experience of menu planning,
                                    kitchen staff supervision, food production
                                    and inventory management Deep knowledge of
                                    cooking practices, food storage methods and
                                    food preservation techniques Commendable
                                    knowledge of food nutritional values, health
                                    standards and kitchen sanitary practices
                                </p>
                            </div>
                            <div className="work_exp_card">
                                <h5>Software Developer</h5>
                                <p>
                                    I've worked in software engineering for my
                                    entire 15-year career, and my commitment to
                                    critical thinking and attention to detail
                                    have gotten me to where I am today: a senior
                                    software engineer for First Technology. I
                                    have a passion for processes, and I'm an
                                    experienced team leader who typically
                                    manages 10 developers at any given time.
                                </p>
                            </div>
                        </div>

                        <div className="education">
                            <h1>Education</h1>
                            <div className="education_card">
                                <h5>Computer Science</h5>
                                <p>Cebu Technological University</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Work experience, education, and skills sections will go here */}
            </PDFExport>
        </div>
    );
};

export default Resume;
