import React from "react";
import "./notfound.css";
import { NavLink } from "react-router-dom";
import notfound from "../../images/notfound.png";

const NotFound = () => {
    return (
        <div className="notfound_container">
            <div className="notfound_left">
                <h1>Ooops...</h1>
                <h4>Page not found</h4>
                <NavLink exact={true} to="/home" key="Home">
                    <button>Back to Home Page</button>
                </NavLink>
            </div>
            <div className="notfound_right">
                <img src={notfound} alt="" />
            </div>
        </div>
    );
};

export default NotFound;
