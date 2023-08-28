import React from "react";
import { FaAngry, FaCheck, FaCross } from "react-icons/fa";
import "./snackbar.css";

function Snackbar(props) {
    return (
        <div
            className="snackbar"
            style={{
                backgroundColor:
                    props.type === "success" ? "#00f593" : "#ff0033",
            }}
        >
            <div className="snackbar_symbol">
                {props.type === "success" ? <FaCheck /> : <FaAngry />}
            </div>
            <div className="snackbar_message">{props.message}</div>
        </div>
    );
}

export default Snackbar;
