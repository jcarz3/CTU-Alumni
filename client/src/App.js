import React, { useEffect, useState } from "react";
import "./App.css";
import { createContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Components and pages
import Main from "./components/Main/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Analytics from "./pages/Analytics/Analytics";
import Alumni from "./pages/Alumni/Alumni";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import UserList from "./pages/UserList/UserList";
import EditUser from "./components/EditUser/EditUser";
import JobPosting from "./components/JobPosting/JobPosting";
import Job from "./components/Forms/Job";
import NotFound from "./pages/NotFound/NotFound";
import AddAlumni from "./components/AddAlumni/AddAlumni";
import Events from "./components/Events/Events";
import Event from "./components/Event/Event";
import Resume from "./components/Resume/Resume";
import ResumeBuilder from "./components/ResumeBuilder/ResumeBuilder";
import JobList from "./components/JobPosting/JobList/JobList"; //acceptjob ni
import RequestList from "./components/Request/RequestList";
import RawEvents from "./components/Events/RawEvents";

export const ThemeContext = createContext(null);

function App() {
    const user = localStorage.getItem("token");

    const [theme, setTheme] = useState("light");
    const toggleTheme = () => {
        setTheme((curr) => (curr === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className="App" id={theme}>
                <Routes>
                    <Route path="/signup" exact element={<Signup />} />
                    <Route path="/login" exact element={<Login />} />
                    <Route
                        path="/"
                        element={<Navigate replace to="/login" />}
                    />
                </Routes>
                {user && (
                    <Main theme={theme} toggleTheme={toggleTheme} user={user}>
                        <Routes>
                            <Route
                                path="/home"
                                exact
                                element={<Home user={user} theme={theme} />}
                            />
                            <Route path="/alumni" exact element={<Alumni />} />
                            <Route
                                path="/analytics"
                                exact
                                element={<Analytics />}
                            />
                            <Route
                                path="/profile"
                                exact
                                element={<Profile user={user} />}
                            ></Route>
                            <Route
                                path="/userlist"
                                exact
                                element={<UserList user={user} />}
                            ></Route>
                            <Route
                                path="/user/:id"
                                exact
                                element={<EditUser />}
                            ></Route>
                            <Route
                                path="/jobposting"
                                exact
                                element={<JobPosting user={user} />}
                            ></Route>
                            <Route
                                path="/jobposting/acceptjobs"
                                exact
                                element={<JobList user={user} />}
                            ></Route>
                            <Route
                                path="/job/:id"
                                exact
                                element={<Job user={user} />}
                            ></Route>
                            <Route
                                path="/addalumni"
                                exact
                                element={<AddAlumni user={user} />}
                            ></Route>
                            <Route
                                path="/events"
                                exact
                                element={<Events user={user} />}
                            ></Route>
                            <Route
                                path="/event/:id"
                                exact
                                element={<Event user={user} />}
                            ></Route>
                            <Route
                                path="/events/acceptevents"
                                exact
                                element={<RawEvents user={user} />}
                            ></Route>
                            <Route
                                path="/requestId"
                                exact
                                element={<RequestList user={user} />}
                            ></Route>
                            <Route
                                path="/resume"
                                exact
                                element={<Resume user={user} />}
                            ></Route>
                            <Route
                                path="/resumeBuilder"
                                exact
                                element={<ResumeBuilder user={user} />}
                            ></Route>
                            <Route
                                path="/*"
                                exact
                                element={<NotFound />}
                            ></Route>
                        </Routes>
                    </Main>
                )}
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
