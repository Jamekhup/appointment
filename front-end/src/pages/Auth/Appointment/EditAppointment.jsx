import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";

const EditAppointment = ({ show, close, maxWidth, handleUpdate, editData }) => {
    const [patientId, setPatientId] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [patients, setPatients] = useState(null);
    const [services, setServices] = useState(null);
    const [date, setDate] = useState(editData.date);
    const [time, setTime] = useState(editData.time);
    const [comment, setComment] = useState(editData.comment);
    const [doctor, setDoctor] = useState(editData.doctor_name);
    const [status, setStatus] = useState(0);
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
                    setPatientId(editData.patient_id);
                    setServiceId(editData.service_id);
                    setFetching(false);
                }
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .put(
                "/appointment/update/" + editData.id,
                {
                    patientId,
                    serviceId,
                    date,
                    time,
                    comment,
                    doctor,
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                handleUpdate(response.data.data);
                setLoading(false);
                close();
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
            <div className="flex justify-between items-center bg-gray-300 p-2 px-4 rounded-t-md">
                <div>Update Appointment</div>
                <div
                    className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                    onClick={close}
                >
                    &times;
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-3 text-sm"
            >
                <div className="flex flex-col text-sm">
                    <label htmlFor="services">Select Patient</label>
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
                <div className="flex flex-col text-sm">
                    <label htmlFor="time">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                    >
                        <option value={0}>Active</option>
                        <option value={1}>Finish</option>
                        <option value={2}>Cancel</option>
                    </select>
                    {error && error.status && (
                        <div className="text-xs mt-1 font-medium text-red-600">
                            {error.status[0]}
                        </div>
                    )}
                </div>
                <div className="flex flex-col text-sm col-span-1 sm:col-span-3">
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        id="comment"
                        placeholder="Enter comment"
                        value={comment}
                        rows={3}
                        onChange={(e) => setComment(e.target.value)}
                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                    ></textarea>
                    {error && error.comment && (
                        <div className="text-xs mt-1 font-medium text-red-600">
                            {error.comment[0]}
                        </div>
                    )}
                </div>
                <PrimaryButton
                    type={loading ? "button" : "submit"}
                    className="w-full md:w-1/2 xl:w-1/3 mt-2"
                >
                    {loading ? "Updating..." : "Update"}
                </PrimaryButton>
            </form>
        </Modal>
    );
};

export default EditAppointment;
