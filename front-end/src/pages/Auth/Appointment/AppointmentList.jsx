import Header from "../../../components/MetaTitle";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEyeSlash,
    faEye,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const AppointmentList = () => {
    const { user } = useAuthContext();
    const [appointments, setAppointments] = useState(null);

    const getData = () => {
        axios
            .get("appointment-list", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                setAppointments(res.data.appointments);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Header title="Appointment List" />
            <div className="flex md:flex-row flex-col md:justify-between justify-start gap-3 items-center mb-2">
                <p>Appointment Lists</p>
            </div>

            <div className="overflow-x-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-[#4b4a4a] uppercase text-white border">
                        <tr className="h-7">
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Date
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Time From
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Time To
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Status
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Created By
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Detail
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {appointments &&
                            appointments.map((appointment, i) => (
                                <tr className="text-[15px] font-normal" key={i}>
                                    <td className="border border-separate py-1 pl-2">
                                        {appointment.date}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {appointment.time}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {appointment.finish_date_time
                                            ? appointment.finish_date_time
                                            : "-"}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        <div className="flex items-center w-fit outline-none border border-slate-300 rounded-md px-2">
                                            <span
                                                className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                                    appointment.status == 0 &&
                                                    "bg-green-500"
                                                } ${
                                                    appointment.status == 1 &&
                                                    "bg-blue-500"
                                                }
                                                        ${
                                                            appointment.status ==
                                                                2 &&
                                                            "bg-red-500"
                                                        }
                                                }}`}
                                            ></span>
                                            <span className="text-[13px]">
                                                {appointment.status == 0 &&
                                                    "Active"}
                                                {appointment.status == 1 &&
                                                    "Finished"}
                                                {appointment.status == 2 &&
                                                    "Cancelled"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {appointment.created_by}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        <NavLink
                                            // to={"/app/patient/detail/" + pa.id}
                                            className="flex justify-start items-center gap-1
                                    bg-amber-300 rounded-md px-2 py-[1px] w-fit text-xs"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCircleInfo}
                                            />
                                            <span>Detail</span>
                                        </NavLink>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AppointmentList;
