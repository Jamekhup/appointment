import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import PrimaryButton from "../../../components/PrimaryButton";
import TextInput from "../../../components/TextInput";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";

const EventModal = ({ show, close, maxWidth, eventData }) => {
    const { user } = useAuthContext();

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     axios
    //         .post(
    //             "/appointment/create",
    //             {
    //                 patientId,
    //                 serviceId,
    //                 date,
    //                 time,
    //                 comment,
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${user.token}`,
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             handleCreate(response.data.data);
    //             setComment("");
    //             setPatientId("");
    //             setServiceId("");
    //             setDate("");
    //             setTime("");
    //             close();
    //         })
    //         .catch((error) => {
    //             setError(error.response.data.message);
    //             setLoading(false);
    //         });
    // };

    // useEffect(() => {
    //     getPatients();
    // }, []);

    return (
        <Modal show={show} onClose={close} maxWidth={maxWidth}>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div>Create New Appointment</div>
                    <div
                        className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                        onClick={close}
                    >
                        &times;
                    </div>
                </div>
                <form className="mt-5">
                    <div>Title: {eventData.title}</div>
                    <div>
                        Start Time: {new Date(eventData.start).toLocaleString}
                    </div>
                    {/* <PrimaryButton
                        type={loading ? "button" : "submit"}
                        className=" px-4 mt-4"
                    >
                        {loading ? "Creating..." : "Create"}
                    </PrimaryButton> */}
                </form>
            </div>
        </Modal>
    );
};

export default EventModal;
