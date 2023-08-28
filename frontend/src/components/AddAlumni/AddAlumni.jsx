import React, { useState } from "react";
import "./addalumni.css";
import UserTable from "./UserTable";

import { motion } from "framer-motion";

// /snackbar
import Snackbar from "../../components/Snackbar/Snackbar";

//icons
import { FaUserCircle, FaSave } from "react-icons/fa";
import axios from "axios";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const VerifyUser = ({ user }) => {
    const [data, setData] = useState({
        lastName: "",
        firstName: "",
        userId: "",
        birthday: "",
    });

    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    //snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const SnackbarType = {
        success: "success",
        fail: "fail",
    };

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };
    //para add og job
    const AddAlumni = async (e) => {
        e.preventDefault();

        try {
            const url = "https://ctu-alumni.onrender.com/api/users/addAlumni";
            const { data: res } = await axios.post(url, data);

            setShowSnackbar(true);
            setTimeout(() => {
                setShowSnackbar(false);
            }, 3000);
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
                setShowError(true);

                setTimeout(() => {
                    setShowError(false);
                }, 3000); // 3 seconds
            }
        }
    };

    //para excell
    const [file, setFile] = useState(null);

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        axios
            .post("https://ctu-alumni.onrender.com/api/users/excels", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log(response.data);
            });
    }

    return (
        <div className="verify_container">
            <ScrollToTop />
            {/* snackbar notif */}
            <div
                className="snackbar_position"
                id={showSnackbar ? "show" : "hide"}
            >
                <Snackbar
                    message={"Alumni Added Succesfully"}
                    type={SnackbarType.success}
                />
            </div>

            <div className="header_verify">
                <h5>List of Inactive Alumni</h5>
            </div>
            <div className="verify_body">
                <div className="left_body">
                    <h5>Add Alumni</h5>
                    <form
                        className="formAdd_container"
                        onSubmit={AddAlumni}
                        method="post"
                    >
                        <div className="fname_holderss">
                            <p>Last Name</p>
                            <input
                                type="text"
                                name="lastName"
                                required
                                className="input_fname"
                                onChange={handleChange}
                                value={data.lastName}
                            />
                        </div>

                        <div className="fname_holderss">
                            <p>First Name</p>
                            <input
                                name="firstName"
                                type="text"
                                className="input_fname"
                                required
                                onChange={handleChange}
                                value={data.firstName}
                            />
                        </div>

                        <div className="fname_holderss">
                            <p>Student ID</p>
                            <input
                                type="text"
                                name="userId"
                                className="input_fname"
                                required
                                onChange={handleChange}
                                value={data.userId}
                            />
                        </div>

                        <div className="fname_holderss">
                            <p>Birthday</p>
                            <input
                                name="birthday"
                                type="date"
                                className="input_fname"
                                required
                                onChange={handleChange}
                                value={data.birthday}
                            />
                        </div>
                        {showError && (
                            <div className="styles_error">{error}</div>
                        )}
                        {/* <div className="styles_error">error</div> */}
                        {/* save button */}
                        <div className="button_holders">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="button"
                            >
                                <FaSave className="icon" />
                                <p>Save</p>
                            </motion.button>
                        </div>
                    </form>
                    <p
                        style={{
                            "margin-bottom": "0",
                            "margin-left": "35px",
                            "margin-top": "15px",
                        }}
                    >
                        Tired of inputting it manually?
                    </p>
                    <h5 style={{ "font-size": "15px", "margin-top": "1px" }}>
                        Upload an excel file
                    </h5>
                    {/* form para upload excell file */}
                    <div className="form_container">
                        <form onSubmit={handleSubmit} className="form_excell">
                            <input type="file" onChange={handleFileChange} />
                            <button type="submit">Upload</button>
                        </form>
                    </div>
                </div>
                <div className="AddUser_table">
                    <UserTable userBuang={user} />
                </div>
            </div>
        </div>
    );
};

export default VerifyUser;
