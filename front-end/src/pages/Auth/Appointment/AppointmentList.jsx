import Header from "../../../components/MetaTitle";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleInfo,
    faEdit,
    faFileExcel,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import EditAppointment from "./EditAppointment";
import Loading from "../../../components/Loading";
import Pagination from "../../../components/Pagination";
import ReactDatePicker from "react-datepicker";
import { ExportToExcel } from "../PaymentRecord/ExportToExcel";
import TextInput from "../../../components/TextInput";

const AppointmentList = () => {
    const { user } = useAuthContext();
    const [appointments, setAppointments] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editData, setEditData] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [filterByStatus, setFilterByStatus] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [dataToExport, setDataToExport] = useState([]);

    const [therapists, setTherapists] = useState(null);

    const url = "/appointment-list";
    const [pagination, setPagination] = useState(null);

    const [search, setSearch] = useState("");

    const convertDate = (date) => {
        let newDate = date.split("-");
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
    };

    const getData = (url) => {
        setFetching(true);
        axios
            .get(url, {
                params: { dateRange: dateRange, search: search},
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                setAppointments(res.data.appointments.data);
                setPagination(res.data.appointments);
                setTherapists(res.data.therapists);
                const toExpot = res.data.appointments.data.map((data, i) => ({
                    "No": i + 1,
                    "Service": data.service.name,
                    "Patient":
                        data.patient.title +
                        " " +
                        data.patient.first_name +
                        " " +
                        data.patient.last_name,
                    "Doctor": data.doctor_name,
                    "Therapist": data.user?.name,
                    "Appointment Date": convertDate(data.date),
                    "From": data.from_time,
                    "To": data.to_time,
                    "Status":
                        data.status == 0
                            ? "Active"
                            : data.status == 1
                            ? "Finished"
                            : data.status == 2
                            ? "Cancelled"
                            : "-",
                    
                }));
                setDataToExport(toExpot);
                setFetching(false);
            })
            .catch((err) => {
                console.log(err);
                setFetching(false);
            });
    };

    const handleUpdate = (data) => {
        getData(url);
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
        getData(url);
    }, [dateRange, search]);

    const handlePagination = (paginate_url) => {
        getData(paginate_url ?? url);
        window.scrollTo(0, 0);
    };

    return (
        <>
            <Header title="Appointment List" />
            <div className="flex md:flex-row flex-col md:justify-between justify-start gap-3 items-center mb-2">
                <div className="flex md:flex-row flex-col gap-2 items-center">
                    <ReactDatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                        dateFormat="dd/MM/yyyy"
                        isClearable={true}
                        showIcon
                        calendarIconClassname="react-date-range-picker"
                        className="bg-white h-[30px] rounded-md outline-none border border-slate-300 shadow-sm w-full cursor-pointer placeholder:text-sm placeholder:pl-1 focus:border-slate-400"
                        placeholderText=" Filter By Date"
                    />
                    <TextInput
                        type="text"
                        placeholder="Search by Patient or Therapist Name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="!py-1 !mt-0 w-full"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div className="bg-blue-200 rounded-md flex justify-between items-center mr-3">
                        <div
                            className={`px-5 py-2 text-sm border-r-blue-300 border-r-2 outline-none cursor-pointer font-sans rounded-l-md ${
                                filterByStatus == null
                                    ? "shadow-blue-400 bg-blue-300"
                                    : "bg-blue-200 hover:bg-blue-300"
                            }`}
                            onClick={() => setFilterByStatus(null)}
                        >
                            All
                        </div>
                        <div
                            className={`px-3 py-2 text-sm border-r-blue-300 border-r-2 outline-none cursor-pointer font-sans ${
                                filterByStatus == 0
                                    ? "shadow-blue-400 bg-blue-300"
                                    : "bg-blue-200 hover:bg-blue-300"
                            }`}
                            onClick={() => setFilterByStatus(0)}
                        >
                            Active
                        </div>
                        <div
                            className={`px-3 py-2 text-sm border-r-blue-300 border-r-2 outline-none cursor-pointer font-sans ${
                                filterByStatus == 1
                                    ? "shadow-blue-400 bg-blue-300"
                                    : "bg-blue-200 hover:bg-blue-300"
                            }`}
                            onClick={() => setFilterByStatus(1)}
                        >
                            Finished
                        </div>
                        <div
                            className={`px-3 py-2 text-sm border-r-blue-300 border-r-2 outline-none cursor-pointer font-sans rounded-r-md ${
                                filterByStatus == 2
                                    ? "shadow-blue-400 bg-blue-300"
                                    : "bg-blue-200 hover:bg-blue-300"
                            }`}
                            onClick={() => setFilterByStatus(2)}
                        >
                            Cancelled
                        </div>
                    </div>
                    {appointments && (
                        <ExportToExcel
                            apiData={dataToExport}
                            fileName={"appointment_records"}
                        />
                    )}
                </div>
            </div>

            <div className="relative overflow-y-auto">
                <table className="w-full table-auto">
                    <thead className="bg-[#4b4a4a] uppercase text-white border">
                        <tr className="h-7">
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Patient Name
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Doctor Name
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Therapist
                            </th>
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
                            appointments
                                ?.filter((app) =>
                                    filterByStatus == null
                                        ? app
                                        : app.status == filterByStatus
                                )
                                .map((appointment, i) => (
                                    <tr
                                        className="text-[15px] font-normal"
                                        key={i}
                                    >
                                        <td className="border border-separate py-1 pl-2">
                                            {appointment.patient.title}{" "}
                                            {appointment.patient.first_name}{" "}
                                            {appointment.patient.last_name}
                                        </td>
                                        <td className="border border-separate py-1 pl-2">
                                            {appointment.doctor_name}
                                        </td>
                                        <td className="border border-separate py-1 pl-2">
                                            {appointment.user.name}
                                        </td>
                                        <td className="border border-separate py-1 pl-2">
                                            {appointment.date.split("-")[2]}-
                                            {appointment.date.split("-")[1]}-
                                            {appointment.date.split("-")[0]}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {appointment.from_time}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {appointment.to_time}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            <div className="flex items-center w-fit outline-none border border-slate-300 rounded-md px-2">
                                                <span
                                                    className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                                        appointment.status ==
                                                            0 && "bg-green-500"
                                                    } ${
                                                        appointment.status ==
                                                            1 && "bg-blue-500"
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
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
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
                                <td colSpan={10}>
                                    <Loading />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {pagination && (
                    <Pagination
                        onPaginate={handlePagination}
                        data={pagination}
                    />
                )}
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
                    therapists={therapists}
                    handleUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default AppointmentList;
