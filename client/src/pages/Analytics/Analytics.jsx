import React from "react";
import "./analytics.css";
import { useState } from "react";

const Analytics = () => {

    const [open, setOpen] = useState(false);
	const toggle_arrow = () => setOpen(!open);

    return (
        <div className="title">
            <div className="header_bars">
                <div className="header_content">
                    <h5>Analyticss</h5>
                </div>
            </div>  
        </div>
    );
};

export default Analytics;