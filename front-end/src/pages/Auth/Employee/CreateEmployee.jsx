import { useState } from "react";
import Modal from "../../../components/Modal";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";

const CreateEmployee = ({ show, close, maxWidth, handleCreate }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dashboardAccess, setDashboardAccess] = useState(1);
    const [appointmentAccess, setAppointmentAccess] = useState(1);
    const [appointmentListAccess, setAppointmentListAccess] = useState(0);
    const [patientAccess, setPatientAccess] = useState(0);
    const [paymentAccess, setPaymentAccess] = useState(0);
    const [serviceAccess, setServiceAccess] = useState(0);
    const [employeeAccess, setEmployeeAccess] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { user } = useAuthContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .post(
                "/employee/create",
                {
                    name,
                    email,
                    password,
                    dashboardAccess,
                    appointmentAccess,
                    appointmentListAccess,
                    patientAccess,
                    paymentAccess,
                    serviceAccess,
                    employeeAccess,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                handleCreate(response.data);
                setLoading(false);
                setName("");
                setEmail("");
                setPassword("");
                setDashboardAccess(1);
                setAppointmentAccess(1);
                setAppointmentListAccess(0);
                setPatientAccess(0);
                setPaymentAccess(0);
                setServiceAccess(0);
                setEmployeeAccess(0);
                close();
            })
            .catch((error) => {
                setErrors(error.response.data.message);
                setLoading(false);
            });
    };

    return (
        <Modal show={show} onClose={close} maxWidth={maxWidth}>
            <div className="flex justify-between items-center bg-gray-300 p-2 px-4 rounded-t-md">
                <div>Create New Employee</div>
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
                <div className="flex flex-col">
                    <label htmlFor="name">Name</label>
                    <TextInput
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Employee Name"
                    />
                    {errors && errors.name && (
                        <div className="text-xs mt-1 font-medium text-red-600">
                            {errors.name[0]}
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <TextInput
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Employee Email"
                    />
                    {errors && errors.email && (
                        <div className="text-xs mt-1 font-medium text-red-600">
                            {errors.email[0]}
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <TextInput
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Employee Password"
                    />
                    {errors && errors.password && (
                        <div className="text-xs mt-1 font-medium text-red-600">
                            {errors.password[0]}
                        </div>
                    )}
                </div>
                <div className="font-medium -mb-1 mt-2 col-span-1 md:col-span-2 xl:col-span-3">
                    Employee Access
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 col-span-1 md:col-span-2 xl:col-span-3">
                    <div className="flex items-center gap-x-2">
                        <input
                            id="dashboard_access"
                            type="checkbox"
                            checked={dashboardAccess}
                            onChange={() => setDashboardAccess((prev) => !prev)}
                            className="cursor-pointer"
                        />
                        <label
                            htmlFor="dashboard_access"
                            className="cursor-pointer"
                        >
                            Dashboard Access
                        </label>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <input
                            id="appointment_access"
                            type="checkbox"
                            checked={appointmentAccess}
                            onChange={() =>
                                setAppointmentAccess((prev) => !prev)
                            }
                            className="cursor-pointer"
                        />
                        <label
                            htmlFor="appointment_access"
                            className="cursor-pointer"
                        >
                            Appointment Access
                        </label>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <input
                            id="appointment_list_access"
                            type="checkbox"
                            checked={appointmentListAccess}
                            onChange={() =>
                                setAppointmentListAccess((prev) => !prev)
                            }
                            className="cursor-pointer"
                        />
                        <label
                            htmlFor="appointment_list_access"
                            className="cursor-pointer"
                        >
                            Appointment List Access
                        </label>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <input
                            id="patient_access"
                            type="checkbox"
                            checked={patientAccess}
                            onChange={() => setPatientAccess((prev) => !prev)}
                            className="cursor-pointer"
                        />
                        <label
                            htmlFor="patient_access"
                            className="cursor-pointer"
                        >
                            Patient Access
                        </label>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <input
                            id="payment_record_access"
                            type="checkbox"
                            checked={paymentAccess}
                            onChange={() => setPaymentAccess((prev) => !prev)}
                            className="cursor-pointer"
                        />
                        <label
                            htmlFor="payment_record_access"
                            className="cursor-pointer"
                        >
                            Payment Record Access
                        </label>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <input
                            id="service_access"
                            type="checkbox"
                            checked={serviceAccess}
                            onChange={() => setServiceAccess((prev) => !prev)}
                            className="cursor-pointer"
                        />
                        <label
                            htmlFor="service_access"
                            className="cursor-pointer"
                        >
                            Service Access
                        </label>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <input
                            id="employee_access"
                            type="checkbox"
                            checked={employeeAccess}
                            onChange={() => setEmployeeAccess((prev) => !prev)}
                            className="cursor-pointer"
                        />
                        <label
                            htmlFor="employee_access"
                            className="cursor-pointer"
                        >
                            Employee Access
                        </label>
                    </div>
                </div>
                <PrimaryButton
                    type={loading ? "button" : "submit"}
                    className="w-full md:w-1/2 xl:w-1/3 mt-2"
                >
                    {loading ? "Creating..." : "Create"}
                </PrimaryButton>
            </form>
        </Modal>
    );
};

export default CreateEmployee;
