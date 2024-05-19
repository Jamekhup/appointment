import { useState } from "react";
import Modal from "../../../components/Modal";
import PrimaryButton from "../../../components/PrimaryButton";
import TextInput from "../../../components/TextInput";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import Swal from "sweetalert2";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, setHours, setMinutes } from "date-fns";
import Times from "../../../assets/Times.json";

const CreateReservation = ({ show, close, maxWidth, handleCreate }) => {
    const [date, setDate] = useState(new Date());
    const [fromTime, setFromTime] = useState(
        ''
    );
    const [toTime, setToTime] = useState(
        ''
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .post(
                "/reserve-appointment/create",
                {
                    date: date.toISOString().split("T")[0],
                    fromTime: fromTime,
                    toTime: toTime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                if (response.data.status == "reserved") {
                    Swal.fire({
                        icon: "error",
                        title: response.data.message,
                        showConfirmButton: false,
                        timer: 4500,
                    });
                } else {
                    handleCreate(response.data.data);
                    close();
                }
                setLoading(false);
                setDate(new Date());
                setFromTime(setHours(setMinutes(new Date(), 0), 8));
                setToTime(setHours(setMinutes(new Date(), 0), 21));
            })
            .catch((error) => {
                setError(error.response.data.message);
                setLoading(false);
            });
    };

    return (
        <Modal show={show} onClose={close} maxWidth={maxWidth}>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div>Create Reservation</div>
                    <div
                        className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                        onClick={close}
                    >
                        &times;
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="mt-5 h-[21rem]">
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2
                gap-x-2.5 sm:gap-y-4 gap-y-2.5 items-start"
                    >
                        <div className="flex flex-col text-sm">
                            <label htmlFor="start_date">
                                Reserve Date{" "}
                                <span className="text-red-600">*</span>
                            </label>
                            <ReactDatePicker
                                id="start_date"
                                dateFormat="dd/MM/yyyy"
                                className="w-full h-10 cursor-pointer border px-1.5 text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                                required
                                selected={date}
                                onChange={(date) => setDate(date)}
                            />

                            {error && error.date && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.date[0]}
                                </div>
                            )}
                        </div>

                        {/* <div className="flex flex-col text-sm">
                            <label htmlFor="from_time">
                                From Time{" "}
                                <span className="text-red-600">*</span>
                            </label>
                            <ReactDatePicker
                                selected={fromTime}
                                onChange={(time) => setFromTime(time)}
                                showTimeSelect
                                className="w-full h-10 cursor-pointer border px-1.5 text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                                showTimeSelectOnly
                                timeIntervals={60}
                                timeCaption="Time"
                                timeFormat="HH:mm"
                                dateFormat="HH:mm"
                                id="from_time"
                                required
                            />

                            {error && error.fromTime && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.fromTime[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col text-sm">
                            <label htmlFor="to_time">
                                To Time <span className="text-red-600">*</span>
                            </label>
                            <ReactDatePicker
                                selected={toTime}
                                onChange={(time) => setToTime(time)}
                                showTimeSelect
                                className="w-full h-10 cursor-pointer border px-1.5 text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                                showTimeSelectOnly
                                timeIntervals={60}
                                timeCaption="Time"
                                timeFormat="HH:mm"
                                dateFormat="HH:mm"
                                id="to_time"
                                required
                            />
                            {error && error.toTime && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.toTime[0]}
                                </div>
                            )}
                        </div> */}


<div className="flex flex-col text-sm">
                            <label htmlFor="time">
                                From Time{" "}
                                <span className="text-red-600">*</span>
                            </label>

                            <select
                                className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                                focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                value={fromTime}
                                required
                                onChange={(e) => setFromTime(e.target.value)}
                            >
                                <option
                                    value=""
                                >
                                    Select From Time
                                </option>
                                {Times &&
                                    Times.map((t, i) => (
                                        <option
                                            key={i}
                                            value={t.time}
                                            className="bg-white"
                                        >
                                            {t.time}
                                        </option>
                                    ))}
                            </select>
                            
                            {error && error.formTime && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.formTime[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col text-sm">
                            <label htmlFor="time">
                                To Time{" "}
                                <span className="text-red-600">*</span>
                            </label>

                            <select
                                className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                                focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                value={toTime}
                                required
                                onChange={(e) => setToTime(e.target.value)}
                            >
                                <option
                                    value=""
                                >
                                    Select To Time
                                </option>
                                {Times &&
                                    Times.map((t, i) => (
                                        <option
                                            key={i}
                                            value={t.time}
                                            className="bg-white"
                                        >
                                            {t.time}
                                        </option>
                                    ))}
                            </select>
                            
                            {error && error.toTime && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.toTime[0]}
                                </div>
                            )}
                        </div>
                    </div>

                    <PrimaryButton
                        type={loading ? "button" : "submit"}
                        className=" px-4 mt-4"
                    >
                        {loading ? "Creating..." : "Create"}
                    </PrimaryButton>
                </form>
            </div>
        </Modal>
    );
};

export default CreateReservation;
