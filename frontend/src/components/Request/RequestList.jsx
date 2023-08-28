import React, { useState } from "react";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import "./requestlist.css";
import RequestTable from "./RequestTable";

// loading page

const RequestList = ({ user }) => {
    return (
        <div className="userlist_container">
            <ScrollToTop />
            <div className="userlist_header">
                <div className="header_content">
                    <h5 className="userlist_title">List of Requested Id</h5>
                </div>
                <div className="table">
                    <RequestTable userBuang={user} />
                </div>
            </div>
        </div>
    );
};

export default RequestList;

/** 
import * as React from 'react';




export default function DataGridDemo() {
  return (
    
  );
}

*/
