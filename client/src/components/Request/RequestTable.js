import React from "react";
import DataTable from "./DataTable";
import "./requestlist.css";

import Axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

//para dialog
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import { format } from "timeago.js";

// icons
import { GrFormClose } from "react-icons/gr";

//loading spinner
import FadeLoader from "react-spinners/FadeLoader";

const UserTable = ({ userBuang }) => {
    // state sa User details
    const [user, setUser] = useState([]);

    const [newDate, setNewDate] = useState();

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
        Axios.get("http://localhost:8080/api/users/user/" + userBuang)
            .then((res) => {
                setUserInfo(res.data);
                // ibutang sa user na variable ang data gikan DB
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userInfo]);

    // fetch all Id Request
    useEffect(() => {
        Axios.get("http://localhost:8080/api/requests/all").then((response) => {
            setUser(response.data);
            setLoading(false);
        });
    }, [user]);

    // para update sa date nga gi aprove ang requests
    const updateDate = (id, email, firstName, lastName, event) => {
        event.preventDefault();
        Axios.put(`http://localhost:8080/api/requests/updateDate/${id}`, {
            approvedDate: newDate,
            email: email,
            firstName: firstName,
            lastName: lastName,
        }).then((response) => {
            console.log("nigana na");
        });
    };

    // para update if claim or dili ang alumni ID
    const updateClaimId = (id) => {
        Axios.put(`http://localhost:8080/api/requests/claimId/${id}`, {}).then(
            (response) => {
                console.log("nigana na");
            }
        );
    };

    // delete Request
    const deleteRequest = (id) => {
        Axios.delete(`http://localhost:8080/api/requests/deleteRequest/${id}`);
        setUser(user.filter((item) => item._id !== id));
        console.log("user ids", id);
        handleClose();
    };

    // para format sa date nga mahimong january 10 2000 ang porma
    function formatDate(date) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
    }

    // para header sa table
    const columns = [
        {
            field: "lastName",
            headerName: "Last Name",
            width: 175,
            renderCell: (params) => {
                return (
                    <div>
                        <Link
                            to={"/user/" + params.row.ownerId}
                            className="accept_card_top"
                        >
                            <p
                                style={{
                                    "margin-top": "18px",
                                    "font-size": "13.5px",
                                }}
                            >
                                {params.row.lastName}
                            </p>
                        </Link>
                    </div>
                );
            },
        },
        {
            field: "firstName",
            headerName: "First Name",
            width: 170,
            renderCell: (params) => {
                return (
                    <Link
                        to={"/user/" + params.row.ownerId}
                        className="accept_card_top"
                    >
                        <p
                            style={{
                                "margin-top": "18px",
                                "font-size": "13.5px",
                            }}
                        >
                            {params.row.firstName}
                        </p>
                    </Link>
                );
            },
        },
        {
            field: "requestDate",
            headerName: "Request Date",
            width: 120,
            renderCell: (params) => {
                return (
                    <>
                        <p
                            style={{
                                "margin-top": "9px",
                                fontSize: "12.5px",
                                color: "blue",
                            }}
                        >
                            {format(params.row.requestDate)}
                        </p>
                    </>
                );
            },
        },

        {
            field: "approvedDate",
            headerName: "Approved Date",
            width: 130,
            renderCell: (params) => {
                const formattedDate = formatDate(params.row.approvedDate);
                return (
                    <div>
                        <p
                            style={{
                                "margin-top": "13px",
                                "font-size": "13px",
                            }}
                        >
                            {formattedDate}
                        </p>
                    </div>
                );
            },
        },
        {
            field: "inputDate",
            headerName: "Input Date",
            width: 195,
            renderCell: (params, key) => {
                return (
                    <div key={params.row._id}>
                        <form
                            onSubmit={(event) => {
                                updateDate(
                                    params.row._id,
                                    params.row.email,
                                    params.row.firstName,
                                    params.row.lastName,
                                    event
                                );
                            }}
                        >
                            <input
                                type="date"
                                required
                                className="inputDate"
                                style={{ border: "none", width: "125px" }}
                                onChange={(e) => {
                                    setNewDate(e.target.value);
                                }}
                            ></input>
                            <button
                                style={{
                                    border: "1px solid #3c9b48",
                                    "background-color": "#6cf37e",
                                    width: 50,
                                    height: 24,
                                    "border-radius": "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Save
                            </button>
                        </form>
                    </div>
                );
            },
        },
        {
            field: "action",
            headerName: "Action",
            width: 120,
            renderCell: (params) => {
                return (
                    <div className="button_container">
                        {/* para edit ni */}

                        {params.row.accept ? (
                            <div>
                                <p
                                    style={{
                                        "margin-top": "9px",
                                        "margin-left": "4px",
                                        fontSize: "13px",
                                        color: "green",
                                    }}
                                >
                                    Accepted
                                </p>
                            </div>
                        ) : (
                            <button
                                className="delete_button"
                                onClick={handleClickOpen}
                            >
                                <p
                                    style={{
                                        "margin-top": "9px",
                                        "margin-left": "4px",
                                        fontSize: "13px",
                                        color: "red",
                                    }}
                                >
                                    Reject
                                </p>
                            </button>
                        )}

                        {/* Dialog para confirmation to delete */}
                        <Dialog
                            // width={400}
                            // height={500}
                            open={open}
                            onClose={handleClose}
                            className="delete_dialog"
                        >
                            <div className="header_close">
                                <DialogTitle>
                                    <h5>Delete Confirmation</h5>
                                </DialogTitle>
                                <div>
                                    {" "}
                                    <GrFormClose
                                        className="close_button"
                                        onClick={handleClose}
                                    />
                                </div>
                            </div>
                            <div className="body_close">
                                <h1>Are you sure you want to delete?</h1>
                            </div>
                            <div className="footer_close">
                                <Button onClick={handleClose}>Cancel</Button>
                                <button
                                    onClick={() => {
                                        deleteRequest(params.row._id);
                                    }}
                                    className="button_delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </Dialog>
                    </div>
                );
            },
        },
        {
            field: "claimId",
            headerName: "Mark as",
            width: 190,
            renderCell: (params) => {
                return (
                    <div className="button_container">
                        {/* para edit ni */}

                        {params.row.claimId ? (
                            <div>
                                <p
                                    style={{
                                        "margin-top": "9px",
                                        "margin-left": "4px",
                                        fontSize: "13px",
                                        color: "green",
                                    }}
                                >
                                    Claimed
                                </p>
                            </div>
                        ) : (
                            <button
                                className="update_button"
                                onClick={() => {
                                    updateClaimId(params.row._id);
                                }}
                            >
                                <p
                                    style={{
                                        "margin-top": "9px",
                                        "margin-left": "4px",
                                        fontSize: "13px",
                                        color: "gray",
                                    }}
                                >
                                    Claim
                                </p>
                            </button>
                        )}
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
