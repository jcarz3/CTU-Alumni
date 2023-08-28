import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import ctu from "../../images/ctu.png";
import Snackbar from "../../components/Snackbar/Snackbar";

const Signup = () => {
    const [data, setData] = useState({
        // firstName: "",
        // lastName: "",
        userId: "",
        birthday: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    //snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showDeleteSnackbar, setShowDeleteSnackbar] = useState(false);
    const SnackbarType = {
        success: "success",
        fail: "fail",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "https://ctu-alumni.onrender.com/api/users/register";
            const { data: res } = await axios.put(url, data);

            setShowSnackbar(true);
            setTimeout(() => {
                setShowSnackbar(false);
                navigate("/login");
            }, 3000);
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className={styles.login_container}>
            {/* snackbar notif */}
            <div
                className="snackbar_position"
                id={showSnackbar ? "show" : "hide"}
            >
                <Snackbar
                    message={"Succesfully Registered"}
                    type={SnackbarType.success}
                />
            </div>
            <div className={styles.login_form_container}>
                <div className={styles.header_container}>
                    <div className={styles.header_text}>
                        <h1>Cebu Technological University</h1>
                        <h5>Create an Account</h5>
                    </div>
                    <div className={styles.logo_container}>
                        <img src={ctu} alt="" className={styles.logo} />
                    </div>
                </div>

                <form className={styles.form_container} onSubmit={handleSubmit}>
                    {/* <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        onChange={handleChange}
                        value={data.firstName}
                        required
                        className={styles.input}
                    /> */}
                    {/* <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={handleChange}
                        value={data.lastName}
                        required
                        className={styles.input}
                    /> */}
                    <input
                        type="text"
                        placeholder="Student Id"
                        name="userId"
                        onChange={handleChange}
                        value={data.userId}
                        required
                        className={styles.input}
                    />
                    <input
                        type="date"
                        placeholder="Birthdate"
                        name="birthday"
                        onChange={handleChange}
                        value={data.birthday}
                        required
                        className={styles.input}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        required
                        className={styles.input}
                    />
                    {error && <div className={styles.error_msg}>{error}</div>}
                    <button type="submit" className={styles.green_btn}>
                        SIGN UP
                    </button>
                </form>
                <div className={styles.signup_container}>
                    <p>Already have an Account?</p>
                    <Link to="/login" className={styles.signup_link}>
                        <p>Login Here</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
