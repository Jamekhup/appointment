import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BigCalendar from "../../../components/BigCalendar";
import Header from "../../../components/MetaTitle";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../../../components/PrimaryButton";
import CreateAppointment from "./CreateAppointment";
import { useCallback, useEffect, useState } from "react";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import moment from "moment";
import EventModal from "./EventModal";
import CreateReservation from "./CreateReservation";
import Swal from "sweetalert2";

const Appointment = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEventModal, setOpenEventModal] = useState(false);
    const [openReserveModal, setOpenReserveModal] = useState(false);
    const [eventData, setEventData] = useState(null);
    const [event, setEvent] = useState(null);
    const [fetching, setFetching] = useState(false);
    const { user } = useAuthContext();

    const getEvent = () => {
        setFetching(true);
        axios
            .get("/appointment", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                const eventsFromApi = res.data.events;
                const formattedEvents = eventsFromApi.map((event) => ({
                    ...event,
                    start: moment(event.start).toDate(),
                    end: moment(event.end).toDate(),
                }));

                setEvent(formattedEvents);
                setFetching(false);
            });
    };

    const handleCreate = (data) => {
        const formattedEvent = {
            ...data,
            start: moment(data.start).toDate(),
            end: moment(data.end).toDate(),
        };

        setEvent((prev) => [...prev, formattedEvent]);
    };

    const handleReservationCreate = (data) => {
        const formattedEvent = {
            ...data,
            start: moment(data.start).toDate(),
            end: moment(data.end).toDate(),
        };
        setEvent((prev) => [...prev, formattedEvent]);
    };

    const handleSelectEvent = useCallback((data) => {
        setOpenEventModal(true);
        setEventData(data);
    }, []);

    const changeBgColor = (color) => {
        const intValue = parseInt(color.slice(1), 16);
        const newValue = (intValue + 100) % 0xaaa;
        return "#" + newValue.toString(16).padStart(6, "0");
    };

    const eventPropGetter = useCallback(
        (event) => ({
            style: {
                backgroundColor:
                    event.status == 1
                        ? changeBgColor(event.backgroundColor)
                        : event.backgroundColor,
                animation: event.status == 1 && "pulse 1.5s infinite",
                border: event.status == 1 && event.backgroundColor,
            },
        }),
        []
    );

    const handleCancel = (data) => {
        setEvent((prev) => prev.filter((p) => p.id !== data.id));
        Swal.fire({
            title: "Success!",
            text: "Cancel appointment success",
            icon: "success",
            position: "top",
            timer: 4500,
        });
    };

    const handleFinish = (data) => {
        setEvent((prev) => prev.filter((p) => p.id !== data.id));
        Swal.fire({
            title: "Success!",
            text: "Finished",
            icon: "success",
            position: "top",
            timer: 4500,
        });
    };
    const handleDelete = (id) => {
        setEvent((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({
            title: "Success!",
            text: "Delete appointment success",
            icon: "success",
            position: "top",
            timer: 4500,
        });
    };

    useEffect(() => {
        getEvent();
    }, []);

    return (
        <>
            <Header title="Appointment" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-y-2 gap-x-2 mb-4">
                {user && user.role == 1 && (
                    <PrimaryButton
                        onClick={() => setOpenReserveModal(true)}
                        className="bg-rose-500 hover:bg-rose-400 focus:bg-rose-500"
                    >
                        <span>Reserve Booking</span>
                    </PrimaryButton>
                )}
                <PrimaryButton onClick={() => setOpenCreateModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    <span>Add New Appointment</span>
                </PrimaryButton>
            </div>
            <div>
                {event && (
                    <BigCalendar
                        event={event}
                        handleSelectEvent={handleSelectEvent}
                        eventPropGetter={eventPropGetter}
                    />
                )}
            </div>

            <CreateAppointment
                show={openCreateModal}
                close={() => setOpenCreateModal(false)}
                maxWidth="w-full sm:w-5/6 md:w-2/3 mt-20 sm:-mt-12 md:-mt-20"
                handleCreate={handleCreate}
            />

            {eventData && openEventModal && (
                <EventModal
                    show={openEventModal}
                    close={() => {
                        setOpenEventModal(false);
                        setEventData(null);
                    }}
                    maxWidth="w-full sm:w-5/6 md:w-2/3 -mt-20 md:-mt-40"
                    eventData={eventData}
                    cancelled={handleCancel}
                    finished={handleFinish}
                    deleteReserve={handleDelete}
                />
            )}

            <CreateReservation
                show={openReserveModal}
                close={() => setOpenReserveModal(false)}
                maxWidth="w-full sm:w-5/6 md:w-2/3 mt-0 sm:-mt-62 md:-mt-72"
                handleCreate={handleReservationCreate}
            />
        </>
    );
};

export default Appointment;
