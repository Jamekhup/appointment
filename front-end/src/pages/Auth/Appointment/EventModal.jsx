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
                <form className="mt-5">
                    <div>Title: {eventData.title}</div>
                    {eventData.title == "Reserved" ? (
                        <div>
                            <div>
                                Reserved:{" "}
                                <span className="text-sm">
                                    from{" "}
                                    {new Date(eventData.start).toLocaleString()}{" "}
                                    to{" "}
                                    {new Date(eventData.end).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            Start Time:{" "}
                            {new Date(eventData.start).toLocaleString()}
                        </div>
                    )}

                    {eventData.title !== "Reserved" && (
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
                    )}
                </form>
            </div>
        </Modal>
    );
};

export default EventModal;
