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
    const [services, setServices] = useState(null);

    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const [errors, setErrors] = useState(false);

    const [treatment, setTreatment] = useState("");
    const [therapistId, setTherapistId] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [coveredByInsuranceCompany, setCoveredByInsuranceCompany] =
        useState("");
   
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
                        setServices(res.data.services);

                        setTreatment(JSON.parse(res.data.payment.treatment));
                        setTherapistId(res.data.payment.user_id);
                        setDoctorName(res.data.payment.doctor_name);
                        setCoveredByInsuranceCompany(
                            res.data.payment.full_covered_by_insurance_company
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


    const convertDate = (date) => {
        let newDate = date.split("-");
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
    };

    //start calculation
    const [toggleServiceSearch, setToggleServiceSearch] = useState(false);
    const [search, setSearch] = useState('');

    const addService = (e, service) => {
        
        if(treatment.length > 0){
            const alreadyExist = treatment.find((p) => p.id == service.id);

            if(alreadyExist){
                Swal.fire({
                    title: "This service is already added",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ok"
                })
            }else{
                setTreatment((prevItem) => 
                    [...prevItem, service]
                )

                
            }

            calculateTotal();
        

         }else{
             setTreatment((prevItem) => 
                 [...prevItem, service]
             )

             calculateTotal();
         }

         
    }

    const removeItem = (id) => {
        treatment.map((t) => {
            if(t.id == id){
                setTreatment((prevItem) => 
                    prevItem.filter((p) => p.id!== id)
                )
            }
        })

        calculateTotal();
    }

    const changeNumber = (value, id) => {
        treatment.map((t) => {
            if(t.id == id){
                setTreatment((prevItem) => 
                    prevItem.map((p) => {
                        if(p.id == id){
                            
                            return {
                               ...p,
                                number: value,
                                total_patient_price: Number(value) * Number(p.price),
                                total_insurance_price: Number(value) * Number(p.home_visit_price),
                            }
                            
                            
                        }else{
                            return p
                        }

                        
                    })
                    
                )

                
            }
            
        })

        calculateTotal();
    }


    const calculateTotal = () => {
        let getTotal =  treatment.reduce((acc, item) =>  item.total_patient_price ? acc  + Number(item.total_patient_price) : acc + (1 * Number(item.price)), 0);
        let toReturn = Number(getTotal) + Number(payment.charges);
        return toReturn;
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
                                    <label>
                                        Treatment Service{" "}
                                        <span className="text-red-600">
                                            *
                                        </span>
                                    </label>
                                    <div className="relative w-full">
                                        <TextInput 
                                            onClick={() => setToggleServiceSearch(!toggleServiceSearch)}
                                            className="w-full"
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search ..."
                                        />
                                        {
                                            toggleServiceSearch && (
                                                <div className="absolute bg-slate-300 border border-gray-200 drop-shadow-md p-2 top-11 left-0 right-0 rounded-sm
                                                h-[160px] overflow-y-scroll z-20">
                                                    <div className="flex flex-col gap-y-1.5 text-sm">
                                                        {
                                                            services && services
                                                            .filter(
                                                                (s) =>
                                                                    s.name
                                                                        .toLowerCase()
                                                                        .includes(search.toLowerCase())
                                                            ).
                                                            map((service, i) => (
                                                                <div className="flex justify-between border-b border-slate-100 pb-1 items-center gap-2" key={i}>
                                                                    <span>{service.name}</span>
                                                                    <button
                                                                    type="button"
                                                                    className="bg-amber-200 text-xs px-2 py-[2px] rounded-md"
                                                                        onClick={(e) => addService(e, service)}
                                                                    >Select</button>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label>
                                        Select Therapist{" "}
                                        <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border px-1.5 py-[8.5px] text-sm border-gray-300 text-slate-600 focus:ring-0 
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
                                        className="border px-1.5 py-[8.5px] text-sm border-gray-300 text-slate-600 focus:ring-0 focus:outline-none focus:border-blue-300 mt-1 rounded-md shadow-sm "
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
                            </div>

                            <div className="mt-4">
                                <label className="mb-3">
                                    Selected Treatment Services
                                </label>

                                <div className="flex flex-col gap-y-3">
                                    {
                                        treatment != [] && treatment.length > 0 && (
                                            <div className="relative overflow-y-auto">
                                                <table className="w-[32rem] sm:w-full rounded-lg">
                                                    <thead className="bg-[#4b4a4a] uppercase text-white border">
                                                        <tr className="h-7">

                                                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                                #
                                                            </th>
                                                            
                                                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                                Treatment Service Name
                                                            </th>
                                                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                                Price
                                                            </th>
                                                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                                Number
                                                            </th>
                                                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                                Total Price
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-slate-600">
                                                        
                                                        {
                                                            treatment.map((t,i) => (
                                                                <tr className="text-[15px] font-normal" key={i}>

                                                                    <td className="border border-separate pl-2">
                                                                        <button
                                                                        type="button"
                                                                        className="bg-red-400 text-slate-100 text-xs px-2 py-[2px] rounded-md"
                                                                            onClick={(e) => removeItem(t.id)}
                                                                        >Remove</button>
                                                                    </td>
                                                            
                                                                    <td className="border border-separate pl-2">
                                                                        {t.name}
                                                                    </td>
                                                                    <td className="border border-separate py-1 pl-2">
                                                                        {"€ " + Number(t.price).toLocaleString("es-ES")}
                                                                    </td>
                                                                    <td className="border border-separate px-2">
                                                                        <select 
                                                                            className="w-full outline-none border border-gray-200 rounded-md"
                                                                            onChange = {(e) => changeNumber(e.target.value, t.id)}
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
                                                                    </td>
                                                                    <td className="border border-separate pl-2">
                                                                        {t.total_patient_price ? "€ " + t.total_patient_price.toLocaleString("es-ES") : "€ " + t.price}
                                                                    </td>
                                                                    
                                                                </tr>
                                                            ))
                                                        }

                                                        <tr className="bg-gray-100">
                                                            <td className="border border-separate text-center font-bold" colSpan={4}>
                                                                Total + Service Charges ({"€ " + payment.charges})
                                                            </td>
                                                            <td className="border border-separate pl-2">
                                                                { coveredByInsuranceCompany == 0 ?  "€ " + calculateTotal() : "€ " + 0}
                                                            </td>
                                                        </tr>
                                                        
                                                            
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                    }
                                </div>
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
                                                {convertDate(payment.patient.dob)}
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
