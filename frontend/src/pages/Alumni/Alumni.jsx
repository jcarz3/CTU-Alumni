import React from "react";
import "./alumni.css";
import ArticlesPage from "../../components/Forms/Job";

import { useState, useEffect } from "react";
import Axios from "axios";

const Alumni = () => {
    const [user, setUser] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:8080/api/users/all").then((response) => {
            setUser(response.data);
            console.log(response);
        });
    }, []);

    return (
        <div className="title">
            <div className="header_bar">
                <ArticlesPage />
                {/* <table>
                    <tbody>
                        <tr className="table-row">
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                        </tr>

                        {user.map((val, key) => {
                            return (
                                <tr key={val._id}>
                                    <td>{val.firstName}</td>
                                    <td>{val.lastName}</td>
                                    <td>{val.email}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table> */}
            </div>
        </div>
    );
};

export default Alumni;
