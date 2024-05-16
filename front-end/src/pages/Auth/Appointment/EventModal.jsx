import Modal from "../../../components/Modal";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import { useState } from "react";

const EventModal = ({
    show,
    close,
    maxWidth,
    eventData,
    finished,
    cancelled,
    deleteReserve,
}) => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        setLoading(true);
        axios
            .put(
                "/appointment/cancelled/" + eventData.id,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                cancelled(response.data.data);
                setLoading(false);
                close();
            })
            .catch((error) => {
                setError(error.response.data.message);
                setLoading(false);
            });
    };

    const handleFinished = () => {
        setLoading(true);
        axios
            .put(
                "/appointment/finished/" + eventData.id,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                finished(response.data.data);
                setLoading(false);
                close();
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const handleDelete = () => {
        setLoading(true);
        axios
            .delete("/reserve-appointment/delete/" + eventData.id, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                deleteReserve(response.data);
                setLoading(false);
                close();
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
                    <div>Appointment</div>
                    <div
                        className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                        onClick={close}
                    >
                        &times;
                    </div>
                </div>
                <form className="mt-3">
                    {eventData.title == "Reserved" ? (
                        <div className="bg-gray-50 rounded-md border border-gray-200 shadow-md p-4">
                            <div className="text-base font-medium text-rose-700">
                                {eventData.title}
                            </div>
                            <table className="w-5/6 mt-4">
                                <tbody>
                                    <tr className="border-b border-red-400">
                                        <td className="py-2">From</td>
                                        <td>
                                            {new Date(
                                                eventData.start
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-red-400">
                                        <td className="py-2">To</td>
                                        <td>
                                            {new Date(
                                                eventData.end
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-md text-[15px] max-h-60 overflow-y-auto shadow-md border border-gray-300">
                            <div className="p-4">
                                <div className="flex justify-between items-center">
                                    <div className="font-medium text-base text-gray-700">
                                        Patient
                                    </div>
                                    <div>
                                        Start Time:{" "}
                                        {new Date(
                                            eventData.start
                                        ).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium text-blue-500">
                                            {eventData.data.patient.title}{" "}
                                            {eventData.data.patient.first_name}{" "}
                                            {eventData.data.patient.last_name}
                                        </span>
                                        <span className="ml-1">
                                            (DOB: {eventData.data.patient.dob})
                                        </span>
                                    </div>
                                </div>
                                <table className="w-5/6 mt-3">
                                    <tbody>
                                        <tr className="border-b border-gray-300">
                                            <td className="py-1">
                                                House Doctor
                                            </td>
                                            <td>
                                                {
                                                    eventData.data.patient
                                                        .house_doctor
                                                }
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-300">
                                            <td className="py-1">
                                                Recommend Doctor
                                            </td>
                                            <td>
                                                {
                                                    eventData.data.patient
                                                        .recommended_doctor
                                                }
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-300">
                                            <td className="py-1">
                                                Special Need
                                            </td>
                                            <td>
                                                {
                                                    eventData.data.patient
                                                        .special_need
                                                }
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-300">
                                            <td className="py-1">
                                                Treatment in 6 month
                                            </td>
                                            <td>
                                                {eventData.data.patient
                                                    .treatment_in_6_month == 0
                                                    ? "No"
                                                    : "Yes"}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-300">
                                            <td className="py-1">
                                                Payment Free
                                            </td>
                                            <td>
                                                {eventData.data.patient
                                                    .payment_free == 0
                                                    ? "No"
                                                    : "Yes"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-[#3e3d3d] rounded-md p-2 text-white">
                                <div className="font-medium text-base">
                                    Service
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>{eventData.data.service.name}</div>
                                    <div className="font-mono">
                                        € {eventData.data.service.price}
                                    </div>
                                </div>
                                <div>
                                    ({eventData.data.service.description})
                                </div>
                            </div>
                        </div>
                    )}

                    {user.appointmentAccess == 1 &&
                        (eventData.title == "Reserved" ? (
                            <PrimaryButton
                                type="button"
                                className="!bg-red-500 border px-4 mt-4 hover:!bg-red-400"
                                onClick={() => handleDelete()}
                            >
                                Delete
                            </PrimaryButton>
                        ) : (
                            <div className="flex items-center gap-x-2">
                                <PrimaryButton
                                    type="button"
                                    className="px-4 mt-4"
                                    onClick={() => handleFinished()}
                                >
                                    Finished
                                </PrimaryButton>
                                <PrimaryButton
                                    type="button"
                                    className="bg-transparent border !border-slate-800 px-4 mt-4 !text-gray-800 hover:bg-transparent hover:text-gray-800"
                                    onClick={() => handleCancel()}
                                >
                                    Cancelled
                                </PrimaryButton>
                            </div>
                        ))}
                </form>
            </div>
        </Modal>
    );
};

export default EventModal;
