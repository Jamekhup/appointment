import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import PrimaryButton from "../../../components/PrimaryButton";
import TextInput from "../../../components/TextInput";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import Swal from "sweetalert2";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, setHours, setMinutes } from "date-fns";
import Times from "../../../assets/Times.json";

const CreateAppointment = ({ show, close, maxWidth, handleCreate }) => {
    const [patients, setPatients] = useState(null);
    const [services, setServices] = useState(null);
    const [therapists, setTherapists] = useState(null);
    const [patientId, setPatientId] = useState("");
    const [therapistId, setTherapistId] = useState("select");
    const [serviceId, setServiceId] = useState("select");
    const [date, setDate] = useState(new Date());
    // const [time, setTime] = useState(setHours(setMinutes(new Date(), 0), 8));
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [times, setTimes] = useState(1);
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
        setSelectedPatient(value.first_name + " " + value.last_name);
        setPatientId(value.id);
    };

    //for new patient
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("01/01/2000");
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
            .get("/patient/get-all", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                if (res.data.status == "success") {
                    setPatients(res.data.patients);
                    setServices(res.data.services);
                    setTherapists(res.data.therapists);
                    setFetching(false);
                }
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (serviceId == "select") {
            setError({ serviceId: ["Please select a service"] });
            setLoading(false);
        } else {
            if (toggleForm == false) {
                if (patientId == "") {
                    setError({ patientId: ["Please select a patient"] });
                    setLoading(false);
                    return;
                }
            }
            if (user?.role == 0 || user?.role == 1) {
                if (therapistId == "select") {
                    setError({ therapistId: ["Please select a therapist"] });
                    setLoading(false);
                    return;
                }
            }
            axios
                .post(
                    "/appointment/create",
                    {
                        patientId,
                        title,
                        firstName,
                        lastName,
                        email,
                        phone,
                        dob:
                            typeof dob === "string"
                                ? dob
                                : dob.toISOString().split("T")[0],
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
                        therapistId,
                        date: date.toISOString().split("T")[0],
                        // time: format(time, "HH:mm"),
                        fromTime: fromTime,
                        toTime: toTime,
                        comment,
                        times,
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
                            timer: 6500,
                        });
                    } else {
                        handleCreate(response.data.data);
                        close();
                    }
                    setComment("");
                    setPatientId("");
                    setServiceId("select");
                    setTherapistId("select");
                    setSelectedPatient("");
                    setDate(new Date());
                    // setTime(setHours(setMinutes(new Date(), 0), 8));
                    setFromTime('');
                    setToTime('');
                    setDoctor("");
                    setTitle("");
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPhone("");
                    setDob("01/01/2000");
                    setStreet("");
                    setCity("");
                    setHouseNumber("");
                    setPostalCode("");
                    setHouseDoctor("");
                    setRecommendedDoctor("");
                    setInsuranceCompany("");
                    setPaymentFree("");
                    setTreatmentInSixMonth("");
                    setPrivatePatient("");
                    setSpecialNeed("");
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setError(error.response);
                    setLoading(false);
                });
        }
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
                        <>
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
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Select Title
                                            </option>
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
                                            First Name{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
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
                                        <label htmlFor="last_name">
                                            Last Name{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
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
                                        <label htmlFor="email">Email Address <span className="text-red-600">*</span></label>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            required
                                        />
                                        {error && error.email && (
                                            <div className="text-xs mt-1 font-medium text-red-600">
                                                {error.email[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col text-sm">
                                        <label htmlFor="phone">Phone Number <span className="text-red-600">*</span></label>
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="4915510686794"
                                            required
                                        />
                                        {error && error.phone && (
                                            <div className="text-xs mt-1 font-medium text-red-600">
                                                {error.phone[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col text-sm">
                                        <label htmlFor="dob">
                                            Date of Birth{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <ReactDatePicker
                                            id="dob"
                                            dateFormat="dd/MM/yyyy"
                                            className="w-full h-10 cursor-pointer border px-1.5 text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                                            required
                                            selected={dob}
                                            onChange={(date) => setDob(date)}
                                        />
                                        {/* {errors && errors.dob && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.dob[0]}
                                        </div>
                                    )} */}
                                    </div>

                                    <div className="flex flex-col text-sm">
                                        <label htmlFor="street">
                                            Street Name{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
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
                                        <label htmlFor="house">
                                            House Number{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
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
                                        <label htmlFor="city">
                                            City{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
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
                                        <label htmlFor="postal">
                                            Postal Code{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
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
                                                setRecommendedDoctor(
                                                    e.target.value
                                                )
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
                                                setInsuranceCompany(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Health Insurance Company Name"
                                        />
                                    </div>

                                    <div className="flex flex-col text-sm">
                                        <label htmlFor="title">
                                            Payment Free (Yes or No){" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
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
                                            Treatment in Six Month (Yes or No){" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
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
                                            Private Patient (Yes or No){" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                            value={privatePatient}
                                            onChange={(e) =>
                                                setPrivatePatient(
                                                    e.target.value
                                                )
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
                            {therapists && (
                                <>
                                    <p className="mb-3 font-semibold border-b border-blue-300">
                                        Select Therapist
                                    </p>
                                    <div className="flex flex-col text-sm w-full mb-4">
                                        <label htmlFor="therapist">
                                            Select Therapist{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                            value={therapistId}
                                            required
                                            onChange={(e) =>
                                                setTherapistId(e.target.value)
                                            }
                                            id="therapist"
                                        >
                                            <option
                                                value="select"
                                                disabled
                                                className="bg-white"
                                            >
                                                Select Therapist
                                            </option>
                                            {therapists &&
                                                therapists.map(
                                                    (therapist, i) => (
                                                        <option
                                                            key={i}
                                                            value={therapist.id}
                                                            className="bg-white"
                                                        >
                                                            {therapist.name}
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                        {error && error.therapistId && (
                                            <div className="text-xs mt-1 font-medium text-red-600">
                                                {error.therapistId[0]}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-between items-start gap-x-3 my-3">
                            <div
                                className={`flex flex-col relative ${
                                    therapists ? "w-full" : "w-1/2"
                                }`}
                            >
                                <label className="text-sm">
                                    Search Patient by name and select{" "}
                                    <span className="text-red-600">*</span>
                                </label>
                                <TextInput
                                    type="text"
                                    value={
                                        selectedPatient
                                            ? selectedPatient
                                            : searchPatient
                                    }
                                    onChange={(e) => handlePatientSearch(e)}
                                    placeholder="Search ..."
                                    className="w-full"
                                />
                                {error && error.patientId && (
                                    <div className="text-xs mt-1 font-medium text-red-600">
                                        {error.patientId[0]}
                                    </div>
                                )}
                                {searchPatient != "" && (
                                    <div className="absolute top-16 max-h-[260px] overflow-y-scroll bg-slate-200 w-full rounded-md p-2">
                                        <div className="flex flex-col gap-2.5">
                                            {patients &&
                                            controlPatientSearch ? (
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
                                                                {
                                                                    result.first_name
                                                                }{" "}
                                                                {
                                                                    result.last_name
                                                                }
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
                            {therapists && (
                                <div className="flex flex-col text-sm w-full">
                                    <label htmlFor="therapist">
                                        Select Therapist{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={therapistId}
                                        required
                                        onChange={(e) =>
                                            setTherapistId(e.target.value)
                                        }
                                        id="therapist"
                                    >
                                        <option
                                            value="select"
                                            disabled
                                            className="bg-white"
                                        >
                                            Select Therapist
                                        </option>
                                        {therapists &&
                                            therapists.map((therapist, i) => (
                                                <option
                                                    key={i}
                                                    value={therapist.id}
                                                    className="bg-white"
                                                >
                                                    {therapist.name}
                                                </option>
                                            ))}
                                    </select>
                                    {error && error.therapistId && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {error.therapistId[0]}
                                        </div>
                                    )}
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
                            <label htmlFor="services">
                                Select Service{" "}
                                <span className="text-red-600">*</span>
                            </label>
                            <select
                                className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                value={serviceId}
                                required
                                onChange={(e) => setServiceId(e.target.value)}
                            >
                                <option
                                    value="select"
                                    disabled
                                    className="bg-white"
                                >
                                    Select Services
                                </option>
                                {services &&
                                    services.map((service, i) => (
                                        <option
                                            key={i}
                                            value={service.id}
                                            className="bg-white"
                                        >
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
                            <label htmlFor="doctor">
                                Doctor Name (optional)
                            </label>
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
                            <label htmlFor="start_date">
                                Appointment Date{" "}
                                <span className="text-red-600">*</span>
                            </label>

                            <ReactDatePicker
                                id="start_date"
                                dateFormat="dd/MM/yyyy"
                                className="w-full h-10 cursor-pointer border px-1.5 text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                                required
                                selected={date}
                                onChange={(date) => setDate(date)}
                            />

                            {error && error.date && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.date[0]}
                                </div>
                            )}
                        </div>

                        {/* <div className="flex flex-col text-sm">
                            <label htmlFor="time">
                                Appointment Time{" "}
                                <span className="text-red-600">*</span>
                            </label>
                            <ReactDatePicker
                                selected={time}
                                onChange={(time) => setTime(time)}
                                showTimeSelect
                                className="w-full h-10 cursor-pointer border px-1.5 text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm"
                                showTimeSelectOnly
                                timeIntervals={60}
                                timeCaption="Time"
                                timeFormat="HH:mm"
                                dateFormat="HH:mm"
                                id="time"
                                required
                            />
                            {error && error.time && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.time[0]}
                                </div>
                            )}
                        </div> */}

                        <div className="flex flex-col text-sm">
                            <label htmlFor="time">
                                From Time{" "}
                                <span className="text-red-600">*</span>
                            </label>

                            <select
                                className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                                focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                value={fromTime}
                                required
                                onChange={(e) => setFromTime(e.target.value)}
                            >
                                <option
                                    value=""
                                >
                                    Select From Time
                                </option>
                                {Times &&
                                    Times.map((t, i) => (
                                        <option
                                            key={i}
                                            value={t.time}
                                            className="bg-white"
                                        >
                                            {t.time}
                                        </option>
                                    ))}
                            </select>
                            
                            {error && error.formTime && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.formTime[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col text-sm">
                            <label htmlFor="time">
                                To Time{" "}
                                <span className="text-red-600">*</span>
                            </label>

                            <select
                                className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                                focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                value={toTime}
                                required
                                onChange={(e) => setToTime(e.target.value)}
                            >
                                <option
                                    value=""
                                >
                                    Select To Time
                                </option>
                                {Times &&
                                    Times.map((t, i) => (
                                        <option
                                            key={i}
                                            value={t.time}
                                            className="bg-white"
                                        >
                                            {t.time}
                                        </option>
                                    ))}
                            </select>
                            
                            {error && error.toTime && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.toTime[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col text-sm">
                            <label htmlFor="time">
                                For how many times{" "}
                                <span className="text-red-600">*</span>
                            </label>

                            <select
                                className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0
                                focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                value={times}
                                required
                                onChange={(e) => setTimes(e.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                            </select>
                            
                            {error && error.times && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {error.times[0]}
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
