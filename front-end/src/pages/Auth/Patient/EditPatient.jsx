import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditPatient = () => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false);
    const { id } = useParams();

    const navigate = useNavigate();

    //form state
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

    const getPatient = () => {
        axios
            .get("/patient/detail/" + id, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                if (res.data.status == "success") {
                    setTitle(res.data.patient.title);
                    setFirstName(res.data.patient.first_name);
                    setLastName(res.data.patient.last_name);
                    setEmail(res.data.patient.email);
                    setPhone(res.data.patient.phone);
                    setDob(res.data.patient.dob);
                    setStreet(res.data.patient.street);
                    setHouseNumber(res.data.patient.house_number);
                    setCity(res.data.patient.city);
                    setPostalCode(res.data.patient.postal_code);
                    setHouseDoctor(res.data.patient.house_doctor);
                    setRecommendedDoctor(res.data.patient.recommended_doctor);
                    setInsuranceCompany(
                        res.data.patient.health_insurance_company
                    );
                    setPaymentFree(res.data.patient.payment_free);
                    setTreatmentInSixMonth(
                        res.data.patient.treatment_in_6_month
                    );
                    setPrivatePatient(res.data.patient.private_patient);
                    setSpecialNeed(res.data.patient.special_need);
                }
            });
    };

    useEffect(() => {
        getPatient();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            axios
                .put(
                    "/patient/update/" + id,
                    {
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
                .then((res) => {
                    if (res.data.status == "success") {
                        setLoading(false);
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
                        Swal.fire({
                            title: "Success!",
                            text: "New Patient updated successfully",
                            icon: "success",
                            position: "top",
                            timer: 4500,
                        });
                        navigate("/app/patient");
                    } else {
                        setLoading(false);
                        Swal.fire({
                            title: "Error!",
                            text: "Something went wrong. Please try again",
                            icon: "error",
                            position: "top",
                            timer: 4500,
                        });
                    }
                });
        } catch (error) {
            if (error.response.status === 422) {
                setErrors(error.response.data.message);
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Header title="Create Patient" />
            <div className="flex justify-between items-center">
                <div className="flex justify-end items-center gap-x-2 mb-1">
                    <PrimaryButton onClick={() => window.history.back()}>
                        <FontAwesomeIcon icon={faAnglesLeft} className="mr-2" />
                        <span>Back</span>
                    </PrimaryButton>
                </div>

                <div className="font-serif font-medium text-base">
                    Edit Patient Info
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 mb-3">
                <div
                    className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 
                gap-x-2.5 sm:gap-y-4 gap-y-2.5 items-start"
                >
                    <div className="flex flex-col text-sm">
                        <label htmlFor="title">Title <span className="text-red-600">*</span></label>
                        <select
                            className="border px-1.5 py-[8.5px] text-sm border-gray-300 text-slate-600 focus:ring-0 
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                        <label htmlFor="first_name">First Name <span className="text-red-600">*</span></label>
                        <TextInput
                            id="first_name"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                        />
                        {errors && errors.firstName && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.firstName[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col text-sm">
                        <label htmlFor="last_name">Last Name <span className="text-red-600">*</span></label>
                        <TextInput
                            id="last_name"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Smith"
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
                        <label htmlFor="dob">Date of Birth <span className="text-red-600">*</span></label>
                        <DatePicker
                            selected={dob}
                            onChange={(date) => setDob(date)}
                            dateFormat="dd/MM/yyyy"
                            isClearable={true}
                            placeholderText="Select Date of Birth"
                            calendarIconClassname="react-date-picker"
                            className="border px-1.5 h-[38px] py-2 text-sm border-gray-300 
                            text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm w-full"
                        />
                        {errors && errors.dob && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.dob[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col text-sm">
                        <label htmlFor="street">Street Name <span className="text-red-600">*</span></label>
                        <TextInput
                            id="street"
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="Street Name"
                        />
                        {errors && errors.street && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.street[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col text-sm">
                        <label htmlFor="house">House Number <span className="text-red-600">*</span></label>
                        <TextInput
                            id="house"
                            type="text"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            placeholder="House Number"
                        />
                        {errors && errors.houseNumber && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.houseNumber[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col text-sm">
                        <label htmlFor="city">City <span className="text-red-600">*</span></label>
                        <TextInput
                            id="city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City Name"
                        />
                        {errors && errors.city && (
                            <div className="text-xs mt-1 font-medium text-red-600">
                                {errors.city[0]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col text-sm">
                        <label htmlFor="postal">Postal Code <span className="text-red-600">*</span></label>
                        <TextInput
                            id="postal"
                            type="number"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="989098"
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
                            onChange={(e) => setHouseDoctor(e.target.value)}
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
                        <label>Health Insurance Company (optional)</label>
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
                        <label htmlFor="title">Payment Free (Yes or No) <span className="text-red-600">*</span></label>
                        <select
                            className="border px-1.5 py-[8.5px] text-sm border-gray-300 text-slate-600 focus:ring-0 
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                            value={paymentFree}
                            onChange={(e) => setPaymentFree(e.target.value)}
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
                            Treatment in Six Month (Yes or No) <span className="text-red-600">*</span>
                        </label>
                        <select
                            className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0 
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                            value={treatmentInSixMonth}
                            onChange={(e) =>
                                setTreatmentInSixMonth(e.target.value)
                            }
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
                            Private Patient (Yes or No) <span className="text-red-600">*</span>
                        </label>
                        <select
                            className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0 
                        focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                            value={privatePatient}
                            onChange={(e) => setPrivatePatient(e.target.value)}
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
                    <label className="text-sm">Special Need (Optional)</label>
                    <textarea
                        className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 
                    focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                        rows={7}
                        value={specialNeed}
                        onChange={(e) => setSpecialNeed(e.target.value)}
                    ></textarea>
                </div>

                <PrimaryButton
                    type={loading ? "button" : "submit"}
                    className=" px-4 mt-2"
                >
                    {loading ? "Updating..." : "Update"}
                </PrimaryButton>
            </form>
        </>
    );
};

export default EditPatient;
