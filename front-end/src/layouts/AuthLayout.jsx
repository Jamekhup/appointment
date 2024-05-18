import { useState } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faSignOut } from "@fortawesome/free-solid-svg-icons";
import useAuthContext from "../context/AuthContext";
import Cookies from "js-cookie";
import axios from "../axios";

// icon svg image imports
import DashboardImage from "../assets/dashboard.svg";
import AppointmentImage from "../assets/appointment.svg";
import ListImage from "../assets/list.svg";
import PatientImage from "../assets/patient.svg";
import paymentImage from "../assets/payments.svg";
import ServiceImage from "../assets/service.svg";
import EmployeeImage from "../assets/employee.svg";
import SettingImage from "../assets/setting.svg";

const AuthLayout = () => {
    const navigate = useNavigate();

    const { setUser, user } = useAuthContext();

    const [toggleNav, setToggleNav] = useState(true);
    const [toggleLogout, setToggleLogout] = useState(false);

    const handleLogOut = () => {
        axios.post("/logout", {
            headers: { Authorization: "Bearer " + user.token },
        });

        setUser(null);
        Cookies.remove("app_sys");
        navigate("/");
    };
    if (user) {
        return (
            <>
                <div
                    className={
                        toggleNav
                            ? "flex justify-start items-start gap-1.5 font-inter"
                            : "flex justify-start items-start font-inter"
                    }
                >
                    {/* start sidenav */}

                    <nav
                        className={
                            toggleNav
                                ? "w-[220px] h-screen bg-white drop-shadow-sm transition-all duration-100"
                                : "w-[0px] h-screen bg-white transition-all duration-100 overflow-x-hidden"
                        }
                    >
                        <div className="flex justify-center items-center py-1.5 bg-[#3e3d3d]">
                            <h1 className="text-xl text-slate-100">
                                Appointment
                            </h1>
                        </div>
                        <div className="flex flex-col gap-y-3 justify-start gap-1.5 text-sm">
                            {/* {user.dashboardAccess == 1 && ( */}
                            <NavLink
                                to={"/app/dashboard"}
                                className={({ isActive }) =>
                                    isActive
                                        ? "flex justify-start items-center gap-2 px-2 py-2.5 bg-blue-200"
                                        : "flex justify-start items-center gap-2 px-2 py-2.5"
                                }
                            >
                                <img src={DashboardImage} alt="" />
                                <span className="text-slate-600">
                                    Dashboard
                                </span>
                            </NavLink>
                            {/* )} */}
                            <NavLink
                                to={"/app/appointment"}
                                className={({ isActive }) =>
                                    isActive
                                        ? "flex justify-start items-center gap-2 px-2 py-2.5 bg-blue-200"
                                        : "flex justify-start items-center gap-2 px-2 py-2.5"
                                }
                            >
                                <img src={AppointmentImage} alt="" />
                                <span className="text-slate-600">
                                    Appointment
                                </span>
                            </NavLink>
                            {user.appointmentListAccess == 1 && (
                                <NavLink
                                    to={"/app/list"}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex justify-start items-center gap-2 px-2 py-2.5 bg-blue-200"
                                            : "flex justify-start items-center gap-2 px-2 py-2.5"
                                    }
                                >
                                    <img src={ListImage} alt="" />
                                    <span className="text-slate-600">
                                        Appointment Lists
                                    </span>
                                </NavLink>
                            )}
                            {user.patientAccess == 1 && (
                                <NavLink
                                    to={"/app/patient"}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex justify-start items-center gap-2 px-2 py-2.5 bg-blue-200"
                                            : "flex justify-start items-center gap-2 px-2 py-2.5"
                                    }
                                >
                                    <img src={PatientImage} alt="" />
                                    <span className="text-slate-600">
                                        Patients
                                    </span>
                                </NavLink>
                            )}
                            {user.paymentAccess == 1 && (
                                <NavLink
                                    to={"/app/payments"}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex justify-start items-center gap-2 px-2 py-2.5 bg-blue-200"
                                            : "flex justify-start items-center gap-2 px-2 py-2.5"
                                    }
                                >
                                    <img src={paymentImage} alt="" />
                                    <span className="text-slate-600">
                                        Payment Record
                                    </span>
                                </NavLink>
                            )}
                            {user.serviceAccess == 1 && (
                                <NavLink
                                    to={"/app/service"}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex justify-start items-center gap-2 px-2 py-2.5 bg-blue-200"
                                            : "flex justify-start items-center gap-2 px-2 py-2.5"
                                    }
                                >
                                    <img src={ServiceImage} alt="" />
                                    <span className="text-slate-600">
                                        Services
                                    </span>
                                </NavLink>
                            )}
                            {user.employeeAccess == 1 && (
                                <NavLink
                                    to={"/app/therapist"}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex justify-start items-center gap-2 px-2 py-2.5 bg-blue-200"
                                            : "flex justify-start items-center gap-2 px-2 py-2.5"
                                    }
                                >
                                    <img
                                        src={EmployeeImage}
                                        alt=""
                                        className="w-4"
                                    />
                                    <span className="text-slate-600">
                                        Therapist
                                    </span>
                                </NavLink>
                            )}
                            <NavLink
                                to={"/app/setting"}
                                className={({ isActive }) =>
                                    isActive
                                        ? "flex justify-start items-center gap-2 px-2 py-2.5 bg-blue-200"
                                        : "flex justify-start items-center gap-2 px-2 py-2.5"
                                }
                            >
                                <img src={SettingImage} alt="" />
                                <span className="text-slate-600">Setting</span>
                            </NavLink>
                        </div>
                    </nav>

                    {/* end sidenav */}
                    <div className="w-full">
                        <div className="bg-white flex justify-between items-center w-full p-2 text-sm">
                            <div
                                className="cursor-pointer"
                                onClick={() => setToggleNav(!toggleNav)}
                            >
                                <svg
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4 7C4 6.44771 4.44772 6 5 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H5C4.44772 8 4 7.55229 4 7Z"
                                        fill="#000000"
                                    />
                                    <path
                                        d="M4 13.9998C4 13.4475 4.44772 12.9997 5 12.9997L16 13C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15L5 14.9998C4.44772 14.9998 4 14.552 4 13.9998Z"
                                        fill="#000000"
                                    />
                                    <path
                                        d="M5 19.9998C4.44772 19.9998 4 20.4475 4 20.9998C4 21.552 4.44772 21.9997 5 21.9997H22C22.5523 21.9997 23 21.552 23 20.9998C23 20.4475 22.5523 19.9998 22 19.9998H5Z"
                                        fill="#000000"
                                    />
                                </svg>
                            </div>
                            <div
                                className="flex justify-self-start items-center gap-2.5 sticky top-0 z-50
                            drop-shadow-md cursor-pointer"
                                onClick={() => setToggleLogout(!toggleLogout)}
                            >
                                <p>{user.user}</p>
                                <FontAwesomeIcon icon={faCaretDown} />
                            </div>

                            {/* logout popup */}
                            {toggleLogout && (
                                <div
                                    className="absolute inset-0 z-30"
                                    onClick={() => setToggleLogout(false)}
                                >
                                    <div
                                        className="absolute right-1 top-10  bg-white w-[150px] h-10 px-1.5 py-2
                                    rounded-md drop-shadow-lg border border-gray-200 hover:bg-rose-300"
                                        onClick={handleLogOut}
                                    >
                                        <div className="flex justify-center items-center gap-1.5 cursor-pointer">
                                            <FontAwesomeIcon
                                                icon={faSignOut}
                                                className="text-red-400"
                                            />
                                            <p>Logout</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* end logout popup */}
                        </div>
                        <main className="bg-white p-2 mt-2 drop-shadow-sm">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </>
        );
    } else {
        return <Navigate to="/" />;
    }
};

export default AuthLayout;
