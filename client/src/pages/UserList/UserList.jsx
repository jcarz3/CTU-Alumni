import React, { useState } from "react";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import "./userlist.css";
import UserTable from "./UserTable";

// loading page

const UserList = ({ user }) => {
    return (
        <div className="userlist_container">
            <ScrollToTop />
            <div className="userlist_header">
                <div className="header_content">
                    <h5 className="userlist_title">List of Active Alumni</h5>
                </div>
                <div className="table">
                    <UserTable userBuang={user} />
                </div>
            </div>
        </div>
    );
};

export default UserList;

/** 
import * as React from 'react';




export default function DataGridDemo() {
  return (
    
  );
}

*/
