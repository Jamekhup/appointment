import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BigCalendar from "../../../components/BigCalendar";
import Header from "../../../components/MetaTitle";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PrimaryButton from "../../../components/PrimaryButton";
import CreateAppointment from "./CreateAppointment";
import { useState } from "react";

const Appointment = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);

    return (
        <>
            <Header title="Appointment" />
            <div className="flex justify-end items-center gap-x-2 mb-4">
                <PrimaryButton onClick={() => setOpenCreateModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    <span>Create</span>
                </PrimaryButton>
                <PrimaryButton>
                    <span>Reserve Booking</span>
                </PrimaryButton>
            </div>
            <div>
                <BigCalendar
                // event={event}
                // handleSelectEvent={handleSelectEvent}
                // eventPropGetter={eventPropGetter}
                />
            </div>

            <CreateAppointment
                show={openCreateModal}
                close={() => setOpenCreateModal(false)}
                maxWidth="w-full sm:w-5/6 md:w-2/3 mt-0 sm:-mt-20 md:-mt-28"
            />
        </>
    );
};

export default Appointment;
