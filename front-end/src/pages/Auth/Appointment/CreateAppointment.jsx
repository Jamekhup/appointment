import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import PrimaryButton from "../../../components/PrimaryButton";
import TextInput from "../../../components/TextInput";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import Swal from "sweetalert2";

const CreateAppointment = ({ show, close, maxWidth, handleCreate }) => {
    const [patients, setPatients] = useState(null);
    const [services, setServices] = useState(null);
    const [patientId, setPatientId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [comment, setComment] = useState("");
    const [doctor, setDoctor] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useAuthContext();

    const getPatients = () => {
        setFetching(true);
        axios
            .get("/patient", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                if (res.data.status == "success") {
                    setPatients(res.data.patients);
                    setServices(res.data.services);
                    setPatientId(res.data.patients[0].id);
                    setServiceId(res.data.services[0].id);
                    setFetching(false);
                }
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .post(
                "/appointment/create",
                {
                    patientId,
                    serviceId,
                    date,
                    time,
                    comment,
                    doctor,
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
                setComment("");
                setPatientId(patients[0].id);
                setServiceId(services[0].id);
                setDate("");
                setTime("");
                setDoctor("");
                setLoading(false);
            })
            .catch((error) => {
                setError(error.response.data.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        getPatients();
    }, []);

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
                <form onSubmit={handleSubmit} className="mt-5">
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2
                gap-x-2.5 sm:gap-y-4 gap-y-2.5 items-start"
                    >
                        <div className="flex flex-col text-sm">
                            <label htmlFor="title">Select Patient</label>
                            <select
                                className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                value={patientId}
                                required
                                onChange={(e) => setPatientId(e.target.value)}
                            >
                                {patients &&
                                    patients.map((patient, i) => (
                                        <option key={i} value={patient.id}>
                                            {patient.title} {patient.first_name}{" "}
                                            {patient.last_name}
                                        </option>
                                    ))}
                            </select>
                            {error && error.patientId && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.patientId[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col text-sm">
                            <label htmlFor="services">Select Service</label>
                            <select
                                className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                value={serviceId}
                                required
                                onChange={(e) => setServiceId(e.target.value)}
                            >
                                {services &&
                                    services.map((service, i) => (
                                        <option key={i} value={service.id}>
                                            {service.name}
                                        </option>
                                    ))}
                            </select>
                            {error && error.serviceId && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.serviceId[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col text-sm">
                            <label htmlFor="doctor">Doctor Name</label>
                            <TextInput
                                id="doctor"
                                type="text"
                                value={doctor}
                                placeholder="Enter a doctor name"
                                onChange={(e) => setDoctor(e.target.value)}
                            />

                            {error && error.doctor && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.doctor[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col text-sm">
                            <label htmlFor="start_date">Appointment Date</label>
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
                            <label htmlFor="time">Appointment Time</label>
                            <TextInput
                                id="time"
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                            {error && error.time && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.time[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col text-sm col-span-1 sm:col-span-2">
                            <label htmlFor="comment">Comment</label>
                            <textarea
                                id="comment"
                                placeholder="Enter comment"
                                rows={3}
                                className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                            ></textarea>
                            {error && error.comment && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.comment[0]}
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

export default CreateAppointment;
