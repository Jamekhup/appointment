import {
    faAnglesLeft
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../components/PrimaryButton";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import LoadingState from "../../../components/Loading";

const PatientDetail = () => {
    const {id} = useParams();
    const {user} = useAuthContext();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = () => {
        setLoading(true);
       
        try {
            axios.get(`/patient/detail/${id}`,{
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }).then((res) => {
                if(res.data.status == 'success'){
                    setLoading(false);
                    setPatient(res.data.patient);
                    
                }
    
                if(res.data.status == 'fail'){
                    navigate('/app/patient');
                }
                setLoading(false);
            })
        } catch (error) {
            if(error.response.status == 422){
                setLoading(false);
                console.log(error);
                navigate('/not-found');
            }
        }

        
    }

    useEffect(() => {
        fetchData();
    },[]);
    return (
        <>
            <Header title="Patient Detail"/>
            <div className="flex justify-between items-center text-sm">
                <PrimaryButton className="flex gap-1 items-center "
                onClick={() => window.history.back()}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                    <p>Back</p>
                </PrimaryButton>
                <p>Patient Detail</p>
            </div>

            {
                !loading && patient? (
                    <div className="grid md:grid-cols-2 grid-cols-1 items-start gap-4 mt-6 mb-2 text-sm">
                        <div>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Full Name
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.title} {" "}{patient.first_name}{' '}{patient.last_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Date Of Birth
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.dob}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Address
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.street}{", "}{patient.house_number}{", "}{patient.city}{", "}{patient.postal_code}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            House Doctor
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.house_doctor? patient.house_doctor : '-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Recommended Doctor
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.recommended_doctor?patient.recommended_doctor:'-'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Insurance Company
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.health_insurance_company}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Payment Free
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.payment_free == 1 ? 'Yes': 'No'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Treatment in Six months
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.treatment_in_6_months == 1 ? 'Yes': 'No'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Private Patient
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.private_patient == 1 ? 'Yes': 'No'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            Special Need
                                        </td>
                                        <td className="border-b border-gray-200 px-3 py-1.5">
                                            {patient.special_need ? patient.special_need : '-'}
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                ):(
                    <LoadingState/>
                )
            }
        </>
    );
};

export default PatientDetail;
