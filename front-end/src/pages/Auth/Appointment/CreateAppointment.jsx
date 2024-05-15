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

    const [toggleForm, setToggleForm] = useState(false);

    // for searchPatient
    const [searchPatient, setSearchPatient] = useState("");
    const [selectedPatient, setSelectedPatient] = useState("");
    const [controlPatientSearch, setControlPatientSearch] = useState(false);

    const handlePatientSearch = (e) => {
        setSelectedPatient("");
        setControlPatientSearch(true);
        setSearchPatient(e.target.value);
    };

    const selectPatient = (value) => {
        setControlPatientSearch(false);
        setSearchPatient("");
        setSelectedPatient({
            ...value,
            full_name: value.first_name + " " + value.last_name,
        });
        setPatientId(value.id);
    };

    //for new patient
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [houseDoctor, setHouseDoctor] = useState("");
    const [recommendedDoctor, setRecommendedDoctor] = useState("");
    const [insuranceCompany, setInsuranceCompany] = useState("");
    const [paymentFree, setPaymentFree] = useState("");
    const [treatmentInSixMonth, setTreatmentInSixMonth] = useState("");
    const [privatePatient, setPrivatePatient] = useState("");
    const [specialNeed, setSpecialNeed] = useState("");

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
                    title,
                    firstName,
                    lastName,
                    dob,
                    street,
                    houseNumber,
                    city,
                    postalCode,
                    houseDoctor,
                    recommendedDoctor,
                    insuranceCompany,
                    paymentFree,
                    treatmentInSixMonth,
                    privatePatient,
                    specialNeed,
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
                <form
                    onSubmit={handleSubmit}
                    className="mt-3 max-h-[27rem] overflow-y-auto"
                >
                    <div className="flex items-center justify-center gap-x-2">
                        <div
                            className={`rounded-md px-2 py-1 cursor-pointer ${
                                toggleForm
                                    ? "bg-transparent"
                                    : "bg-gray-600 text-white"
                            }`}
                            onClick={() => setToggleForm(false)}
                        >
                            Existed Patient
                        </div>
                        <div
                            className={`rounded-md px-2 py-1 cursor-pointer ${
                                toggleForm
                                    ? "bg-gray-600 text-white"
                                    : "bg-transparent"
                            }`}
                            onClick={() => setToggleForm(true)}
                        >
                            New Patient
                        </div>
                    </div>

                    {toggleForm ? (
                        <div>
                            <p className="mb-3 font-semibold border-b border-blue-300">
                                Patient Information
                            </p>
                            <div
                                className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1
                                    gap-x-2.5 sm:gap-y-4 gap-y-2.5 items-start"
                            >
                                <div className="flex flex-col text-sm">
                                    <label htmlFor="title">Title</label>
                                    <select
                                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    >
                                        <option value="">Select Title</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Ms">Ms</option>
                                        <option value="Mrs">Mrs</option>
                                    </select>
                                    {/* {errors && errors.title && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.title[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="first_name">
                                        First Name
                                    </label>
                                    <TextInput
                                        id="first_name"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        placeholder="John"
                                        required
                                    />
                                    {/* {errors && errors.firstName && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.firstName[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="last_name">Last Name</label>
                                    <TextInput
                                        id="last_name"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        placeholder="Smith"
                                        required
                                    />
                                    {/* {errors && errors.lastName && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.lastName[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="dob">Date of Birth</label>
                                    <TextInput
                                        id="dob"
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        required
                                    />
                                    {/* {errors && errors.dob && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.dob[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="street">Street Name</label>
                                    <TextInput
                                        id="street"
                                        type="text"
                                        value={street}
                                        onChange={(e) =>
                                            setStreet(e.target.value)
                                        }
                                        placeholder="Street Name"
                                        required
                                    />
                                    {/* {errors && errors.street && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.street[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="house">House Number</label>
                                    <TextInput
                                        id="house"
                                        type="text"
                                        value={houseNumber}
                                        onChange={(e) =>
                                            setHouseNumber(e.target.value)
                                        }
                                        placeholder="House Number"
                                        required
                                    />
                                    {/* {errors && errors.houseNumber && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.houseNumber[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="city">City</label>
                                    <TextInput
                                        id="city"
                                        type="text"
                                        value={city}
                                        onChange={(e) =>
                                            setCity(e.target.value)
                                        }
                                        placeholder="City Name"
                                        required
                                    />
                                    {/* {errors && errors.city && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.city[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="postal">Postal Code</label>
                                    <TextInput
                                        id="postal"
                                        type="number"
                                        value={postalCode}
                                        onChange={(e) =>
                                            setPostalCode(e.target.value)
                                        }
                                        placeholder="989098"
                                        required
                                    />
                                    {/* {errors && errors.postalCode && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.postalCode[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="house_doctor">
                                        House Doctor (optional)
                                    </label>
                                    <TextInput
                                        id="house_doctor"
                                        type="text"
                                        value={houseDoctor}
                                        onChange={(e) =>
                                            setHouseDoctor(e.target.value)
                                        }
                                        placeholder="House Doctor"
                                    />
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="recommended_doctor">
                                        Recommended Doctor (optional)
                                    </label>
                                    <TextInput
                                        id="recommended_doctor"
                                        type="text"
                                        value={recommendedDoctor}
                                        onChange={(e) =>
                                            setRecommendedDoctor(e.target.value)
                                        }
                                        placeholder="Recommended Doctor"
                                    />
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label>
                                        Health Insurance Company (optional)
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={insuranceCompany}
                                        onChange={(e) =>
                                            setInsuranceCompany(e.target.value)
                                        }
                                        placeholder="Health Insurance Company Name"
                                    />
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="title">
                                        Payment Free (Yes or No)
                                    </label>
                                    <select
                                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={paymentFree}
                                        onChange={(e) =>
                                            setPaymentFree(e.target.value)
                                        }
                                    >
                                        <option value="">Select One</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                    {/* {errors && errors.paymentFree && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.paymentFree[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="title">
                                        Treatment in Six Month (Yes or No)
                                    </label>
                                    <select
                                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={treatmentInSixMonth}
                                        onChange={(e) =>
                                            setTreatmentInSixMonth(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Select One</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                    {/* {errors && errors.treatmentInSixMonth && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.treatmentInSixMonth[0]}
                                        </div>
                                    )} */}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="title">
                                        Private Patient (Yes or No)
                                    </label>
                                    <select
                                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={privatePatient}
                                        onChange={(e) =>
                                            setPrivatePatient(e.target.value)
                                        }
                                    >
                                        <option value="">Select One</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                    {/* {errors && errors.privatePatient && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.privatePatient[0]}
                                        </div>
                                    )} */}
                                </div>
                            </div>

                            <div className="w-full flex flex-col mt-4 mb-4">
                                <label className="text-sm">
                                    Special Need (Optional)
                                </label>
                                <textarea
                                    className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600
                                        focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                    rows={7}
                                    value={specialNeed}
                                    onChange={(e) =>
                                        setSpecialNeed(e.target.value)
                                    }
                                ></textarea>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col mb-3 relative mt-3">
                            <label>Search Patient by name and select</label>
                            <TextInput
                                type="text"
                                value={
                                    searchPatient || selectedPatient?.full_name
                                }
                                onChange={(e) => handlePatientSearch(e)}
                                placeholder="Search ..."
                                className="md:w-[49.7%] w-full"
                            />
                            {/* {errors && errors.name && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {errors.name[0]}
                                </div>
                            )} */}

                            {searchPatient != "" && (
                                <div className="absolute top-16 max-h-[260px] overflow-y-scroll bg-slate-200 md:w-[49.7%] w-full rounded-md p-2">
                                    <div className="flex flex-col gap-2.5">
                                        {patients && controlPatientSearch ? (
                                            patients
                                                .filter(
                                                    (pt) =>
                                                        pt.first_name
                                                            .toLowerCase()
                                                            .includes(
                                                                searchPatient.toLocaleLowerCase()
                                                            ) ||
                                                        pt.last_name
                                                            .toLowerCase()
                                                            .includes(
                                                                searchPatient.toLocaleLowerCase()
                                                            )
                                                )
                                                .map((result, i) => (
                                                    <div
                                                        className="flex justify-between items-center border-b border-amber-100 text-sm"
                                                        key={i}
                                                    >
                                                        <p>
                                                            {result.first_name}{" "}
                                                            {result.last_name}
                                                        </p>
                                                        <button
                                                            className="cursor-pointer bg-gray-600 px-2.5 rounded-md text-xs text-slate-200 py-[1px]"
                                                            onClick={() =>
                                                                selectPatient(
                                                                    result
                                                                )
                                                            }
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="flex justify-between items-center border-b border-amber-100 text-sm">
                                                <p>No Result</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <p className="mb-3 font-semibold border-b border-blue-300">
                        Appointment Form
                    </p>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2
                gap-x-2.5 sm:gap-y-4 gap-y-2.5 items-start"
                    >
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
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
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
