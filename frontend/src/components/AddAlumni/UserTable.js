import React from "react";
import DataTable from "./DataTable";
import "./addalumni.css";

import Axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";

//loading spinner
import FadeLoader from "react-spinners/FadeLoader";

const UserTable = ({ userBuang }) => {
    // state sa User details
    const [user, setUser] = useState([]);

    //loading page
    const [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#36d7b7");

    // para Dialog sa Image upload
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // para kuha sa usa ka data sa user
    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        Axios.get("https://ctu-alumni.onrender.com/api/users/user/" + userBuang)
            .then((res) => {
                setUserInfo(res.data);
                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userInfo]);

    // fetch all not active account
    useEffect(() => {
        Axios.get("https://ctu-alumni.onrender.com/api/users/allNotActive").then(
            (response) => {
                setUser(response.data);
                setLoading(false);
            }
        );
    }, [user]);

    // activate a single account
    const activateUser = (id) => {
        console.log(id);
        Axios.put("https://ctu-alumni.onrender.com/api/users/activateAlumni", {
            id: id,
        }).then(() => {
            setUser(user.filter((item) => item._id !== id));
            handleClose();
        });
        console.log("gipislit na");
    };
    // Reject User or delete
    const deleteUser = (id) => {
        Axios.delete(`https://ctu-alumni.onrender.com/api/users/deleteUser/${id}`);
        setUser(user.filter((item) => item._id !== id));

        console.log("user ids", id);
        handleClose();
    };

    // para format sa date
    function formatDate(date) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
    }

    // para header sa table
    const columns = [
        {
            field: "lastName",
            headerName: "Last Name",
            width: 180,
        },
        { field: "firstName", headerName: "First Name", width: 180 },
        { field: "userId", headerName: "Student Id", width: 200 },
        // { field: "birthday", headerName: "Birthday", width: 150 },

        {
            field: "birthday",
            headerName: "Birthday",
            width: 150,
            renderCell: (params) => {
                const formattedDate = formatDate(params.row.birthday);
                return (
                    <div>
                        <p>{formattedDate}</p>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            {loading ? (
                <div className="loading_page">
                    <FadeLoader
                        loading={loading}
                        size={200}
                        aria-label="Loading Spinner"
                        color={color}
                    />
                    <label htmlFor="">Loading...</label>
                </div>
            ) : (
                <DataTable
                    rows={user}
                    columns={columns}
                    rowsPerPageOptions={[2]}
                />
            )}
        </>
    );
};

export default UserTable;
