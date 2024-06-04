import { useState } from "react";
import Modal from "../../../components/Modal";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";

const CreatePayment = ({
    show,
    close,
    maxWidth,
    handleCreate,
    patient,
    therapist,
    services
}) => {
    const [treatment, setTreatment] = useState("");
    const [therapistId, setTherapistId] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [coveredByInsuranceCompany, setCoveredByInsuranceCompany] =
        useState(0);
    const [number, setNumber] = useState("");
    const [cost, setCost] = useState(0);
    const [additionalPayment, setAdditionalPayment] = useState("");
    const [homeVisit, setHomeVisit] = useState(0);
    const [number2, setNumber2] = useState("");
    const [cost3, setCost3] = useState("");
    const [additionalPayment4, setAdditionalPayment4] = useState("");
    const [totalPayment, setTotalPayment] = useState("");
    const [remark, setRemark] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { user } = useAuthContext();

    const [toggleForm, setToggleForm] = useState(false);

    // search patient
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
        setSelectedPatient(value);
        console.log(selectedPatient);
    };

    //for new patient
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
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

    const [newTreatment, setNewTreatment] = useState("");
    const [newDoctorName, setNewDoctorName] = useState("");
    const [newCoveredByInsuranceCompany, setNewCoveredByInsuranceCompany] =
        useState("");
    const [newNumber, setNewNumber] = useState("");
    const [newCost, setNewCost] = useState("");
    const [newAdditionalPayment, setNewAdditionalPayment] = useState("");
    const [newHomeVisit, setNewHomeVisit] = useState("");
    const [newNumber2, setNewNumber2] = useState("");
    const [newCost3, setNewCost3] = useState("");
    const [newAdditionalPayment4, setNewAdditionalPayment4] = useState("");
    const [newTotalPayment, setNewTotalPayment] = useState("");
    const [newRemark, setNewRemark] = useState("");

    const submitExisted = (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            axios
                .post(
                    "/payment-record/create/existed",
                    {
                        patient_id: selectedPatient.id,
                        treatment,
                        therapistId,
                        doctorName,
                        coveredByInsuranceCompany,
                        number,
                        cost,
                        additionalPayment,
                        homeVisit,
                        number2,
                        cost3,
                        additionalPayment4,
                        totalPayment,
                        remark,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                )
                .then((response) => {
                    console.log(response);
                    setLoading(false);
                    if (response.data.status == "success") {
                        handleCreate(response.data.payment);
                        setSelectedPatient("");
                        setTreatment("");
                        setTherapistId("");
                        setDoctorName("");
                        setCoveredByInsuranceCompany("");
                        setNumber("");
                        setCost("");
                        setAdditionalPayment("");
                        setHomeVisit("");
                        setNumber2("");
                        setCost3("");
                        setAdditionalPayment4("");
                        setTotalPayment("");
                        setRemark("");
                        close();
                    }
                })
                .catch((error) => {
                    setErrors(error.response.data.message);
                    setLoading(false);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const submitNew = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .post(
                "/payment-record/create/new",
                {
                    newTreatment,
                    therapistId,
                    newDoctorName,
                    newCoveredByInsuranceCompany,
                    newNumber,
                    newCost,
                    newAdditionalPayment,
                    newHomeVisit,
                    newNumber2,
                    newCost3,
                    newAdditionalPayment4,
                    newTotalPayment,
                    newRemark,
                    title,
                    firstName,
                    lastName,
                    email,
                    phone,
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
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((response) => {
                if (response.data.status == "success") {
                    handleCreate(response.data.payment);
                    setLoading(false);
                    setTreatment("");
                    setTherapistId("");
                    setDoctorName("");
                    setCoveredByInsuranceCompany("");
                    setNumber("");
                    setCost("");
                    setAdditionalPayment("");
                    setHomeVisit("");
                    setNumber2("");
                    setCost3("");
                    setAdditionalPayment4("");
                    setTotalPayment("");
                    setRemark("");
                    setTitle("");
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPhone("");
                    setDob("");
                    setStreet("");
                    setHouseNumber("");
                    setCity("");
                    setPostalCode("");
                    setHouseDoctor("");
                    setRecommendedDoctor("");
                    setInsuranceCompany("");
                    setPaymentFree("");
                    setTreatmentInSixMonth("");
                    setPrivatePatient("");
                    setSpecialNeed("");
                    close();
                }
            })
            .catch((error) => {
                setErrors(error.response.data.message);
                setLoading(false);
            });
    };

    const changeDateFormat = (value) => {
        let change = value.split("/");
        let newDate = change[2] + "/" + change[1] + "/" + change[0];
        setDob(newDate);
    };

    //calculate existed
    const selectExistedTreatment = (value) => {

        let getValue = JSON.parse(value);
        setTreatment(getValue.name.toString());
        console.log(treatment);
        setNumber(1);
        
        if(homeVisit == 0){
            setCost(Number(getValue.price));
            setTotalPayment(Number(getValue.price));
        }

        if(homeVisit == 1){
            setCost(Number(getValue.home_visit_price));
            setTotalPayment(getValue.home_visit_price);
        }

    }

    const existedCoveredByInsuranceCompany = (value) => {
        setCoveredByInsuranceCompany(
          value
        )

        if(value == 1){
            setTotalPayment(0);
        }

        if(value == 0){
            
        }
    }

    return (
        <Modal show={show} onClose={close} maxWidth={maxWidth}>
            <div className="h-[500px] overflow-y-scroll">
                <div className="flex justify-between items-center bg-gray-300 p-2 px-4 rounded-t-md">
                    <div>Create New Payment Record</div>
                    <div
                        className="px-2 bg-rose-500 rounded-md text-white font-medium cursor-pointer"
                        onClick={close}
                    >
                        &times;
                    </div>
                </div>

                <div className="flex justify-center items-center my-2 text-xs">
                    <div className="flex gap-3">
                        <div
                            className={
                                toggleForm == false
                                    ? "bg-slate-800 text-slate-200 px-2 py-1 rounded-md cursor-pointer"
                                    : "px-2 py-1 rounded-md cursor-pointer border border-gray-200 bg-slate-200"
                            }
                            onClick={() => setToggleForm(false)}
                        >
                            Existed Patient
                        </div>
                        <div
                            className={
                                toggleForm == true
                                    ? "bg-slate-800 text-slate-200 px-2 py-1 rounded-md cursor-pointer"
                                    : "px-2 py-1 rounded-md cursor-pointer border border-gray-200 bg-slate-200"
                            }
                            onClick={() => setToggleForm(true)}
                        >
                            New Patient
                        </div>
                    </div>
                </div>

                {!toggleForm ? (
                    <form onSubmit={submitExisted} className="p-3 text-sm">
                        <div className="flex flex-col mb-3 relative">
                            <label>
                                Search Patient by name and select{" "}
                                <span className="text-red-600">*</span>
                            </label>
                            <TextInput
                                type="text"
                                value={searchPatient}
                                onChange={(e) => handlePatientSearch(e)}
                                placeholder="Search ..."
                                className="md:w-[49.7%] w-full"
                            />
                            {errors && errors.name && (
                                <div className="text-xs mt-1 font-medium text-red-600">
                                    {errors.name[0]}
                                </div>
                            )}

                            {searchPatient != "" && (
                                <div className="absolute top-16 max-h-[260px] overflow-y-scroll bg-slate-200 md:w-[49.7%] w-full rounded-md p-2">
                                    <div className="flex flex-col gap-2.5">
                                        {patient && controlPatientSearch ? (
                                            patient
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

                        {selectedPatient && (
                            <>
                                <div className="border border-gray-100 rounded-md p-2 my-3 text-sm bg-blue-200">
                                    <p className="mb-2">Patient Information</p>
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-100 px-3 py-2">
                                                    Name
                                                </td>
                                                <td className="border border-gray-100 px-3 py-2">
                                                    {selectedPatient.title}{" "}
                                                    {selectedPatient.first_name}{" "}
                                                    {selectedPatient.last_name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-100 px-3 py-2">
                                                    Date of Birth
                                                </td>
                                                <td className="border border-gray-100 px-3 py-2">
                                                    {selectedPatient.dob}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-100 px-3 py-2">
                                                    Address
                                                </td>
                                                <td className="border border-gray-100 px-3 py-2">
                                                    {selectedPatient.street}
                                                    {", "}
                                                    {
                                                        selectedPatient.house_number
                                                    }
                                                    {", "}
                                                    {selectedPatient.city}
                                                    {", "}
                                                    {
                                                        selectedPatient.postal_code
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-100 px-3 py-2">
                                                    Insurance Comany
                                                </td>
                                                <td className="border border-gray-100 px-3 py-2">
                                                    { selectedPatient.health_insurance_company ? selectedPatient.health_insurance_company : '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="grid md:grid-cols-2 gid-cols-1 gap-2.5 items-start">
                                    <div className="flex flex-col">
                                        <label>
                                            Treatment{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                            value={treatment.name}
                                            onChange={(e) =>
                                                selectExistedTreatment(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Treatment
                                            </option>
                                            {services &&
                                                services.map(
                                                    (service, i) => (
                                                        <option
                                                            key={i}
                                                            value={JSON.stringify(service)}
                                                        >
                                                            {service.name}
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                        {errors && errors.treatment && (
                                            <div className="text-xs mt-1 font-medium text-red-600">
                                                {errors.treatment[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <label>
                                            Select Therapist{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                            value={therapistId}
                                            onChange={(e) =>
                                                setTherapistId(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Therapist
                                            </option>
                                            {therapist &&
                                                therapist.map(
                                                    (therapist, i) => (
                                                        <option
                                                            key={i}
                                                            value={therapist.id}
                                                        >
                                                            {therapist.name}
                                                        </option>
                                                    )
                                                )}
                                        </select>
                                        {errors && errors.therapistId && (
                                            <div className="text-xs mt-1 font-medium text-red-600">
                                                {errors.therapistId[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <label>Doctor Name (Optional)</label>
                                        <TextInput
                                            type="text"
                                            value={doctorName}
                                            onChange={(e) =>
                                                setDoctorName(e.target.value)
                                            }
                                            placeholder="Dr. William ..."
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>
                                            Full Covered By Insurance Company{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                            value={coveredByInsuranceCompany}
                                            onChange={(e) =>
                                                existedCoveredByInsuranceCompany(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col">
                                        <label>
                                            Number{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <TextInput
                                            type="number"
                                            value={number}
                                            onChange={(e) =>
                                                setNumber(e.target.value)
                                            }
                                            placeholder="Number"
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>
                                            Cost{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <TextInput
                                            type="number"
                                            step="any"
                                            value={cost}
                                            onChange={(e) =>
                                                setCost(e.target.value)
                                            }
                                            placeholder="Cost"
                                            required
                                            min="1"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>
                                            Additonal Payment (Optional)
                                        </label>
                                        <TextInput
                                            type="number"
                                            step="any"
                                            value={additionalPayment}
                                            onChange={(e) =>
                                                setAdditionalPayment(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Additonal Payment"
                                            min="1"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>
                                            Home Visit{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                            value={homeVisit}
                                            onChange={(e) =>
                                                setHomeVisit(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label>Number 2 (Optional)</label>
                                        <TextInput
                                            type="number"
                                            value={number2}
                                            onChange={(e) =>
                                                setNumber2(e.target.value)
                                            }
                                            placeholder="Number 2"
                                            min="1"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Cost 3 (Optional)</label>
                                        <TextInput
                                            type="number"
                                            step="any"
                                            value={cost3}
                                            onChange={(e) =>
                                                setCost3(e.target.value)
                                            }
                                            placeholder="Cost 3"
                                            min="1"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label>
                                            Additonal Payment 4 (Optional)
                                        </label>
                                        <TextInput
                                            type="number"
                                            step="any"
                                            value={additionalPayment4}
                                            onChange={(e) =>
                                                setAdditionalPayment4(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Additonal Payment 4"
                                            min="1"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label>
                                            Total Payment{" "}
                                            <span className="text-red-600">
                                                *
                                            </span>
                                        </label>
                                        <TextInput
                                            type="number"
                                            step="any"
                                            value={totalPayment}
                                            onChange={(e) =>
                                                setTotalPayment(e.target.value)
                                            }
                                            placeholder="Total Payment"
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label>Remark (optional)</label>
                                    <textarea
                                        value={remark}
                                        rows={7}
                                        onChange={(e) =>
                                            setRemark(e.target.value)
                                        }
                                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0 
                                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm w-full"
                                    ></textarea>
                                </div>

                                <PrimaryButton
                                    type={loading ? "button" : "submit"}
                                    className=" px-4 mt-2"
                                >
                                    {loading ? "Submitting.." : "Submit"}
                                </PrimaryButton>
                            </>
                        )}
                    </form>
                ) : (
                    <form onSubmit={submitNew} className="p-3 text-sm">
                        <div>
                            <p className="mb-3 font-semibold border-b border-blue-300">
                                Paitent Information
                            </p>
                            <div
                                className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 
                                    gap-x-2.5 sm:gap-y-4 gap-y-2.5 items-start"
                            >
                                <div className="flex flex-col text-sm">
                                    <label htmlFor="title">
                                        Title{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 
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
                                    {errors && errors.title && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.title[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="first_name">
                                        First Name{" "}
                                        <span className="text-red-600">*</span>
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
                                    {errors && errors.firstName && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.firstName[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="last_name">
                                        Last Name{" "}
                                        <span className="text-red-600">*</span>
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
                                    {errors && errors.lastName && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.lastName[0]}
                                        </div>
                                    )}
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
                                    {errors && errors.email && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.email[0]}
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
                                    {errors && errors.phone && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.phone[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="dob">
                                        Date of Birth{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <TextInput
                                        id="dob"
                                        type="date"
                                        value={dob}
                                        onChange={(e) =>
                                            changeDateFormat(e.target.value)
                                        }
                                        placeholder="dd-mm-yyyy"
                                        min="1920-01-01"
                                        max="2040-12-31"
                                        required
                                    />
                                    {errors && errors.dob && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.dob[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="street">
                                        Street Name{" "}
                                        <span className="text-red-600">*</span>
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
                                    {errors && errors.street && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.street[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="house">
                                        House Number{" "}
                                        <span className="text-red-600">*</span>
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
                                    {errors && errors.houseNumber && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.houseNumber[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="city">
                                        City{" "}
                                        <span className="text-red-600">*</span>
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
                                    {errors && errors.city && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.city[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="postal">
                                        Postal Code{" "}
                                        <span className="text-red-600">*</span>
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
                                    {errors && errors.postalCode && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.postalCode[0]}
                                        </div>
                                    )}
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
                                        Payment Free (Yes or No){" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={paymentFree}
                                        onChange={(e) =>
                                            setPaymentFree(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Select One</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                    {errors && errors.paymentFree && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.paymentFree[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="title">
                                        Treatment in Six Month (Yes or No){" "}
                                        <span className="text-red-600">*</span>
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
                                        required
                                    >
                                        <option value="">Select One</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                    {errors && errors.treatmentInSixMonth && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.treatmentInSixMonth[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col text-sm">
                                    <label htmlFor="title">
                                        Private Patient (Yes or No){" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={privatePatient}
                                        onChange={(e) =>
                                            setPrivatePatient(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Select One</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                    {errors && errors.privatePatient && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.privatePatient[0]}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full flex flex-col mt-4 mb-1">
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

                        <div className="mt-4">
                            <p className="mb-3 font-semibold border-b border-blue-300">
                                Payment Record
                            </p>

                            <div className="grid md:grid-cols-2 gid-cols-1 gap-2.5 items-start">
                                <div className="flex flex-col">
                                    <label>
                                        Treatment{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={newTreatment}
                                        onChange={(e) =>
                                            setNewTreatment(e.target.value)
                                        }
                                        placeholder="Treatment ..."
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label>
                                        Select Therapist{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 
                                            focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={therapistId}
                                        onChange={(e) =>
                                            setTherapistId(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Therapist
                                        </option>
                                        {therapist &&
                                            therapist.map((therapist, i) => (
                                                <option
                                                    key={i}
                                                    value={therapist.id}
                                                >
                                                    {therapist.name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors && errors.therapistId && (
                                        <div className="text-xs mt-1 font-medium text-red-600">
                                            {errors.therapistId[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <label>Doctor Name (Optional)</label>
                                    <TextInput
                                        type="text"
                                        value={newDoctorName}
                                        onChange={(e) =>
                                            setNewDoctorName(e.target.value)
                                        }
                                        placeholder="Dr. William ..."
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>
                                        Full Covered By Insurance Company{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={newCoveredByInsuranceCompany}
                                        onChange={(e) =>
                                            setNewCoveredByInsuranceCompany(
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label>
                                        Number{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <TextInput
                                        type="number"
                                        value={newNumber}
                                        onChange={(e) =>
                                            setNewNumber(e.target.value)
                                        }
                                        placeholder="Number"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>
                                        Cost{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={newCost}
                                        onChange={(e) =>
                                            setNewCost(e.target.value)
                                        }
                                        placeholder="Cost"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Additonal Payment (Optional)</label>
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={newAdditionalPayment}
                                        onChange={(e) =>
                                            setNewAdditionalPayment(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Additonal Payment"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>
                                        Home Visit{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={newHomeVisit}
                                        onChange={(e) =>
                                            setNewHomeVisit(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label>Number 2 (Optional)</label>
                                    <TextInput
                                        type="number"
                                        value={newNumber2}
                                        onChange={(e) =>
                                            setNewNumber2(e.target.value)
                                        }
                                        placeholder="Number 2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Cost 3 (Optional)</label>
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={newCost3}
                                        onChange={(e) =>
                                            setNewCost3(e.target.value)
                                        }
                                        placeholder="Cost 3"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label>
                                        Additonal Payment 4 (Optional)
                                    </label>
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={newAdditionalPayment4}
                                        onChange={(e) =>
                                            setNewAdditionalPayment4(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Additonal Payment 4"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label>
                                        Total Payment{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={newTotalPayment}
                                        onChange={(e) =>
                                            setNewTotalPayment(e.target.value)
                                        }
                                        placeholder="Total Payment"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <label>Remark (optional)</label>
                                <textarea
                                    value={newRemark}
                                    rows={7}
                                    onChange={(e) =>
                                        setNewRemark(e.target.value)
                                    }
                                    className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0 
                                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm w-full"
                                ></textarea>
                            </div>
                        </div>

                        <PrimaryButton
                            type={loading ? "button" : "submit"}
                            className=" px-4 mt-2"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </PrimaryButton>
                    </form>
                )}
            </div>
        </Modal>
    );
};

export default CreatePayment;
