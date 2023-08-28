import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Event.css";

import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Event = () => {
    const { id } = useParams(); // get the id from the URL

    const [data, setData] = useState([]);
    // display 1 data
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/events/event/" + id)
            .then((res) => {
                setData(res.data);

                console.log(data);
            })
            .catch((err) => {
                console.log("error ni" + err);
            });
    }, [id]);
    return (
        <div className="event_container">
            <ScrollToTop />
            <div className="events_header">
                <h1>Events</h1>
            </div>
            <div className="event_title">
                <h1>Upcoming Events</h1>
            </div>
            <div className="event_body">
                <div className="event_body_top">
                    <div className="event_body_title">
                        <h1>{data.title}</h1>

                        <h5>
                            {"When:  "}
                            {data.postDate}
                        </h5>
                        <h5>
                            {"Where:  "}
                            {data.where}
                        </h5>
                        <p>{data.description}</p>
                    </div>
                    <div className="event_body_pic">
                        <img
                            src={`http://localhost:8080/eventPic/${data.eventPic}`}
                        ></img>
                    </div>
                </div>

                <div className="event_markRead"></div>
            </div>
        </div>
    );
};

export default Event;
