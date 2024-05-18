import { useState, useEffect } from "react";
import TextInput from "../../../components/TextInput";
import PrimaryButton from "../../../components/PrimaryButton";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "../../../components/Loading";
import Swal from "sweetalert2";

const EditPayment = () => {
    const { id } = useParams();
    const { user } = useAuthContext();

    const [payment, setPayment] = useState(null);
    const [patient, setPatient] = useState(null);
    const [therapist, setTherapist] = useState(null);

    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const [errors, setErrors] = useState(false);

    const [treatment, setTreatment] = useState("");
    const [therapistId, setTherapistId] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [coveredByInsuranceCompany, setCoveredByInsuranceCompany] =
        useState("");
    const [number, setNumber] = useState("");
    const [cost, setCost] = useState("");
    const [additionalPayment, setAdditionalPayment] = useState("");
    const [homeVisit, setHomeVisit] = useState("");
    const [number2, setNumber2] = useState("");
    const [cost3, setCost3] = useState("");
    const [additionalPayment4, setAdditionalPayment4] = useState("");
    const [totalPayment, setTotalPayment] = useState("");
    const [remark, setRemark] = useState("");

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

    const fetchData = () => {
        setLoading(true);

        try {
            axios
                .get(`/payment-record/edit/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    if (res.data.status == "success") {
                        setLoading(false);
                        setPayment(res.data.payment);
                        setPatient(res.data.patient);
                        setTherapist(res.data.therapist);

                        setTreatment(res.data.payment.treatment);
                        setTherapistId(res.data.payment.user_id);
                        setDoctorName(res.data.payment.doctor_name);
                        setCoveredByInsuranceCompany(
                            res.data.payment.full_covered_by_insurance_company
                        );
                        setNumber(res.data.payment.number);
                        setCost(res.data.payment.cost);
                        setAdditionalPayment(
                            res.data.payment.additional_payment
                                ? res.data.payment.additional_payment
                                : ""
                        );
                        setHomeVisit(res.data.payment.home_visit);
                        setCost3(res.data.payment.cost3);
                        setNumber2(
                            res.data.payment.number2
                                ? res.data.payment.number2
                                : ""
                        );
                        setAdditionalPayment4(
                            res.data.payment.additional_payment_4
                                ? res.data.payment.additional_payment_4
                                : ""
                        );
                        setTotalPayment(res.data.payment.total_payment);
                        setRemark(
                            res.data.payment.remark
                                ? res.data.payment.remark
                                : ""
                        );
                    }

                    if (res.data.status == "fail") {
                        navigate("/app/payments");
                    }
                    setLoading(false);
                });
        } catch (error) {
            if (error.response.status == 422) {
                setLoading(false);
                console.log(error);
                navigate("/not-found");
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            axios
                .put(
                    "/payment-record/update/" + id,
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
                    setFormLoading(false);
                    if (response.data.status == "success") {
                        setSelectedPatient("");
                        setTreatment("");
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

                        navigate("/app/payments");

                        Swal.fire({
                            icon: "success",
                            title: "Payment Record Updated Successfully",
                            showConfirmButton: false,
                            timer: 5500,
                        });
                    }
                })
                .catch((error) => {
                    setErrors(error.response.data.message);
                    setFormLoading(false);
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header title="Edit Payment Record" />
            <div className="flex justify-between items-center text-sm">
                <PrimaryButton
                    className="flex gap-1 items-center "
                    onClick={() => window.history.back()}
                >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                    <p>Back</p>
                </PrimaryButton>
                <p>Edit Payment Record</p>
            </div>

            {payment && !loading ? (
                <div className="grid md:grid-cols-2 grid-cols-1 items-start gap-4 text-sm my-6">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gid-cols-1 gap-2.5 items-start">
                                <div className="flex flex-col">
                                    <label>Treatment</label>
                                    <TextInput
                                        type="text"
                                        value={treatment}
                                        onChange={(e) =>
                                            setTreatment(e.target.value)
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
                                    <label>Doctor Name</label>
                                    <TextInput
                                        type="text"
                                        value={doctorName}
                                        onChange={(e) =>
                                            setDoctorName(e.target.value)
                                        }
                                        placeholder="Dr. William ..."
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>
                                        Full Covered By Insurance Company
                                    </label>
                                    <select
                                        className="border px-1.5 py-[9px] text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
                                        value={coveredByInsuranceCompany}
                                        onChange={(e) =>
                                            setCoveredByInsuranceCompany(
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
                                    <label>Number</label>
                                    <TextInput
                                        type="number"
                                        value={number}
                                        onChange={(e) =>
                                            setNumber(e.target.value)
                                        }
                                        placeholder="Number"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Cost</label>
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={cost}
                                        onChange={(e) =>
                                            setCost(e.target.value)
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
                                        value={additionalPayment}
                                        onChange={(e) =>
                                            setAdditionalPayment(e.target.value)
                                        }
                                        placeholder="Additonal Payment"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Home Visit</label>
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
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label>Total Payment</label>
                                    <TextInput
                                        type="number"
                                        step="any"
                                        value={totalPayment}
                                        onChange={(e) =>
                                            setTotalPayment(e.target.value)
                                        }
                                        placeholder="Total Payment"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <label>Remark (optional)</label>
                                <textarea
                                    value={remark}
                                    rows={7}
                                    onChange={(e) => setRemark(e.target.value)}
                                    className="border px-1.5 py-2 text-sm border-gray-300 text-slate-600 focus:ring-0 
                      focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm w-full"
                                ></textarea>
                            </div>

                            <PrimaryButton
                                type={formLoading ? "button" : "submit"}
                                className=" px-4 mt-2"
                            >
                                {formLoading ? "Updating..." : "Update"}
                            </PrimaryButton>
                        </form>
                    </div>

                    <div>
                        <div className="flex flex-col mb-3 relative">
                            <label>
                                Search Patient by name and select to change
                                (Optional)
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

                            {patient && !selectedPatient && (
                                <table className="w-full mt-6">
                                    <thead>
                                        <tr>
                                            <th
                                                colSpan={2}
                                                className="border border-gray-200 px-3 py-1.5 bg-blue-200"
                                            >
                                                Selected Patient Information
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Full Name
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {payment.patient.title}{" "}
                                                {payment.patient.first_name}{" "}
                                                {payment.patient.last_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Date Of Birth
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {payment.patient.dob}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Address
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {payment.patient.street}
                                                {", "}{" "}
                                                {payment.patient.house_number}{" "}
                                                {", "} {payment.patient.city}{" "}
                                                {", "}{" "}
                                                {payment.patient.postal_code}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                House Doctor
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {payment.patient.house_number}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Recommended Doctor
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {
                                                    payment.patient
                                                        .recommended_doctor
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Insurance Company
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {
                                                    payment.patient
                                                        .health_insurance_company
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Payment Free
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {payment.patient.payment_free ==
                                                1
                                                    ? "Yes"
                                                    : "No"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Treatment in Six months
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {payment.patient
                                                    .treatment_in_6_month == 1
                                                    ? "Yes"
                                                    : "No"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Private Patient
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {payment.patient
                                                    .private_patient == 1
                                                    ? "Yes"
                                                    : "No"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                Special Need
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {payment.patient.special_need}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {selectedPatient && (
                            <div className="border border-gray-100 rounded-md p-2 my-3 text-sm bg-blue-200">
                                <p className="mb-2">
                                    New Selected Patient Information
                                </p>
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
                                                {selectedPatient.house_number}
                                                {", "}
                                                {selectedPatient.city}
                                                {", "}
                                                {selectedPatient.postal_code}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <LoadingState />
            )}
        </>
    );
};

export default EditPayment;
