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

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { user } = useAuthContext();

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

                            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                                <div>
                                    <div className="grid gid-cols-1 gap-2.5 items-start">
                                        <div className="flex flex-col">
                                            <label>
                                                Treatment Service{" "}
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
                                        
                                    </div>

                                    <PrimaryButton
                                        type={loading ? "button" : "submit"}
                                        className=" px-4 mt-4"
                                    >
                                        {loading ? "Submitting.." : "Submit"}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </>
                    )}
                </form>
                
            </div>
        </Modal>
    );
};

export default CreatePayment;
