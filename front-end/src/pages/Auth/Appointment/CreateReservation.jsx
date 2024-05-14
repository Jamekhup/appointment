import { useState } from "react";
import Modal from "../../../components/Modal";
import PrimaryButton from "../../../components/PrimaryButton";
import TextInput from "../../../components/TextInput";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import Swal from "sweetalert2";

const CreateReservation = ({ show, close, maxWidth, handleCreate }) => {
    const [date, setDate] = useState("");
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");
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
                    date,
                    fromTime,
                    toTime,
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
                setDate("");
                setFromTime("");
                setToTime("");
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
                <form onSubmit={handleSubmit} className="mt-5">
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2
                gap-x-2.5 sm:gap-y-4 gap-y-2.5 items-start"
                    >
                        <div className="flex flex-col text-sm">
                            <label htmlFor="start_date">Reserve Date</label>
                            <TextInput
                                id="start_date"
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />

                            {error && error.date && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.date[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col text-sm">
                            <label htmlFor="from_time">From Time</label>
                            <TextInput
                                id="from_time"
                                type="time"
                                required
                                value={fromTime}
                                onChange={(e) => setFromTime(e.target.value)}
                            />
                            {error && error.fromTime && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.fromTime[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col text-sm">
                            <label htmlFor="to_time">To Time</label>
                            <TextInput
                                id="to_time"
                                type="time"
                                required
                                value={toTime}
                                onChange={(e) => setToTime(e.target.value)}
                            />
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
