import Header from "../../../components/MetaTitle";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleInfo,
    faEdit,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import EditAppointment from "./EditAppointment";
import Loading from "../../../components/Loading";

const AppointmentList = () => {
    const { user } = useAuthContext();
    const [appointments, setAppointments] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editData, setEditData] = useState(false);
    const [fetching, setFetching] = useState(false);

    const getData = () => {
        setFetching(true);
        axios
            .get("appointment-list", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                setAppointments(res.data.appointments);
                setFetching(false);
            })
            .catch((err) => {
                console.log(err);
                setFetching(false);
            });
    };

    const handleUpdate = (data) => {
        setAppointments((prev) =>
            prev.map((p) => {
                if (p.id === data.id) {
                    return { ...p, ...data };
                } else {
                    return p;
                }
            })
        );
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#4B4A4A",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
            position: "top",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete("/appointment/delete/" + id, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then(() => {
                        setAppointments((prev) =>
                            prev.filter((p) => p.id !== id)
                        );
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
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
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {!fetching &&
                            appointments?.map((appointment, i) => (
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
                                            to={
                                                "/app/list/detail/" +
                                                appointment.id
                                            }
                                            className="flex justify-start items-center gap-1
                                    bg-amber-300 rounded-md px-2 py-[1px] w-fit text-xs"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCircleInfo}
                                            />
                                            <span>Detail</span>
                                        </NavLink>
                                    </td>
                                    <td className="border border-separate pl-2">
                                        <span
                                            className="pr-4 cursor-pointer"
                                            title="Edit Employee"
                                            onClick={() => {
                                                setOpenEditModal(true);
                                                setEditData(appointment);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </span>
                                        <span
                                            className="cursor-pointer"
                                            title="Delete Employee"
                                            onClick={() =>
                                                handleDelete(appointment.id)
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                                className="text-rose-500"
                                            />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        {fetching && (
                            <tr>
                                <td colSpan={7}>
                                    <Loading />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {editData && (
                <EditAppointment
                    show={openEditModal}
                    close={() => {
                        setOpenEditModal(false);
                        setEditData(null);
                    }}
                    maxWidth="w-full sm:w-5/6 md:w-2/3 mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-40"
                    editData={editData}
                    handleUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default AppointmentList;
