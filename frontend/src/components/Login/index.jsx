import React from "react";
import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { Link, Route } from "react-router-dom";
import { motion } from "framer-motion";

import ctu from "../../images/ctu.png";
import ctuLogo from "../../images/ctuLogo.svg";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/auth";
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);
            window.location = "/home";
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
            <div className={styles.login_form_container}>
                <div className={styles.header_container}>
                    <div className={styles.header_text}>
                        <h1>Cebu Technological University</h1>
                        <h5>Sign in</h5>
                    </div>
                    <div className={styles.logo_container}>
                        <img src={ctu} alt="" className={styles.logo} />
                    </div>
                </div>

                <form className={styles.form_container} onSubmit={handleSubmit}>
                    <div className={styles.user}>
                        <input
                            className={styles.email}
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                        />
                        <label for={styles.email}>Email</label>
                    </div>

                    <div className={styles.password}>
                        <input
                            className={styles.password}
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                        />
                        <label for={styles.password}> Password</label>
                    </div>

                    {error && <div className={styles.error_msg}>{error}</div>}

                    <motion.button
                        type="submit"
                        className={styles.green_btn}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1 }}
                    >
                        <h5>LOGIN</h5>
                    </motion.button>
                </form>
                <div className={styles.signup_container}>
                    <p>Dont have and account?</p>
                    <Link to="/signup" className={styles.signup_link}>
                        <p>Sign up Here</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
