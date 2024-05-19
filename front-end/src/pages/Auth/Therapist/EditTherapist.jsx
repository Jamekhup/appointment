import { useState } from "react";
import Modal from "../../../components/Modal";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const EditTherapist = ({show, close,maxWidth, editData,handleUpdate}) => {
    const [name, setName] = useState(editData?.name);
    const [email, setEmail] = useState(editData?.email);
    const [role, setRole] = useState(editData?.role);
    const [dashboardAccess, setDashboardAccess] = useState(
        editData?.dashboard_access
    );
    const [appointmentAccess, setAppointmentAccess] = useState(
        editData?.appointment_access
    );
    const [appointmentListAccess, setAppointmentListAccess] = useState(
        editData?.appointment_list_access
    );
    const [patientAccess, setPatientAccess] = useState(
        editData?.patient_access
    );
    const [paymentAccess, setPaymentAccess] = useState(
        editData?.payment_record_access
    );
    const [serviceAccess, setServiceAccess] = useState(
        editData?.service_access
    );
    const [employeeAccess, setEmployeeAccess] = useState(
        editData?.employee_access
    );
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { user } = useAuthContext();

    const [password, setPassword] = useState("");

    const [showHidePassword, setShowHidePassword] = useState(false);
    const [toggleAccess, setToggleAccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .put(
                "/therapist/update/" + editData.id,
                {
                    name,
                    email,
                    role,
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
                handleUpdate(response.data);
                setLoading(false);
                setName("");
                setEmail("");
                setRole('');
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

    const togglePassword = () => {
        let pass = document.getElementById("password");
        if (password) {
            if (pass.type === "password") {
                pass.type = "text";
                setShowHidePassword(true);
            } else {
                pass.type = "password";
                setShowHidePassword(false);
            }
        }
    };

    const handleRoleSelect = (value) => {
        setRole(value);
        if(value == '2'){
            setToggleAccess(true);
        }else{
            setToggleAccess(false);
        }
    }

    const handleClose = () => {
        close();
        setToggleAccess(false);
    }

    return (
        <Modal show={show} onClose={handleClose} maxWidth={maxWidth}>
            <div className="flex justify-between items-center bg-gray-300 p-2 px-4 rounded-t-md">
                <div>Update Therapist Account</div>
                <div
                    className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                    onClick={handleClose}
                >
                    &times;
                </div>
            </div>
            <form
                onSubmit={handleSubmit}
                className="p-4  text-sm"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">
                    <div className="flex flex-col">
                        <label htmlFor="name">Name <span className="text-red-600">*</span></label>
                        <TextInput
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Name"
                            required
                        />
                        {errors && errors.name && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.name[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email">Email <span className="text-red-600">*</span></label>
                        <TextInput
                            id="email"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                        />
                        {errors && errors.email && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.email[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="role">Select Role <span className="text-red-600">*</span></label>
                        <select className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                        onChange={(e) => handleRoleSelect(e.target.value)}
                        required
                        value={role}
                        >
                            <option value="">Select Role</option>
                            <option value="1">Admin</option>
                            <option value="2">Therapist</option>
                        </select>
                        {errors && errors.role && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.role[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col relative">
                        <label htmlFor="password">Password (Optional)</label>
                        <TextInput
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                        />
                        <FontAwesomeIcon
                            icon={showHidePassword ? faEye : faEyeSlash}
                            className="absolute top-9 right-2 text-sm text-slate-500 cursor-pointer"
                            onClick={() => togglePassword()}
                        />
                        {errors && errors.password && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.password[0]}
                            </div>
                        )}

                    </div>
                </div>
                
                {
                    role == 2 && (
                        <div className="my-4">

                            <div className="font-medium  mb-3 mt-2 col-span-1 md:col-span-2 xl:col-span-3">
                                Therapist Access
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 col-span-1 md:col-span-2 xl:col-span-3">
                                <div className="flex items-center gap-x-2">
                                    <input
                                        id="dashboard_access"
                                        type="checkbox"
                                        checked={dashboardAccess}
                                        onChange={() => setDashboardAccess((prev) => !prev)}
                                        className="cursor-pointer"
                                        disabled
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
                                        disabled
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
                                        Therapist Access
                                    </label>
                                </div>
                            </div>

                        </div>
                    )
                }


                
                <PrimaryButton
                    type={loading ? "button" : "submit"}
                    className="w-full md:w-1/2 xl:w-1/3 mt-4"
                >
                    {loading ? "Updating..." : "Update"}
                </PrimaryButton>
            </form>
        </Modal>
    );
}

export default EditTherapist