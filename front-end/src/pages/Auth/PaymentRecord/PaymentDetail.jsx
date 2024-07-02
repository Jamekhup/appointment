import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../components/PrimaryButton";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import LoadingState from "../../../components/Loading";

const PaymentDetail = () => {
    const { id } = useParams();
    const { user } = useAuthContext();

    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = () => {
        setLoading(true);

        try {
            axios
                .get(`/payment-record/detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    if (res.data.status == "success") {
                        setLoading(false);
                        setPayment(res.data.payment);
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

    const convertDate = (date) => {
        let newDate = date.split("-");
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
    };

    const calculateTotal = () => {
        let getTotal =  JSON.parse(payment.treatment).reduce((acc, item) =>  item.total_patient_price ? acc  + Number(item.total_patient_price) : acc + (1 * Number(item.price)), 0);
        let toReturn = Number(getTotal) + Number(payment.charges);
        return toReturn;
    };

    const calculateInsuranceTotal = () => {
        let getTotal =  JSON.parse(payment.treatment).reduce((acc, item) =>  item.total_insurance_price ? acc  + Number(item.total_insurance_price) : acc + (1 * Number(item.home_visit_price)), 0);
        let toReturn = Number(getTotal);
        return toReturn;
    }

    return (
        <>
            <Header title="Payment Record Detail" />
            <div className="flex justify-between items-center text-sm">
                <PrimaryButton
                    className="flex gap-1 items-center "
                    onClick={() => window.history.back()}
                >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                    <p>Back</p>
                </PrimaryButton>
                <p>Payment Record Detail</p>
            </div>

            {!loading && payment ? (
                <>
                    <div className="grid md:grid-cols-2 grid-cols-1 items-start gap-4 mt-6 mb-2 text-sm">
                        <div>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th
                                            colSpan={2}
                                            className="border border-gray-200 px-3 py-1.5 bg-blue-200"
                                        >
                                            Patient Information
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
                                            Email Address
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.patient.email}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Phone Number
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.patient.phone}
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
                                            {", "} {payment.patient.house_number}{" "}
                                            {", "} {payment.patient.city} {", "}{" "}
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
                                            {payment.patient.recommended_doctor}
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
                                            {payment.patient.payment_free == 1
                                                ? "Yes"
                                                : "No"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Treatment in Six months
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.patient.treatment_in_6_month ==
                                            1
                                                ? "Yes"
                                                : "No"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Private Patient
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.patient.private_patient == 1
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
                        </div>
                        <div>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th
                                            colSpan={2}
                                            className="border border-gray-200 px-3 py-1.5 bg-amber-200"
                                        >
                                            Payment Record Information
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Issue Date
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {convertDate(payment.issue_date)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Therapist
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.user.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Doctor Name
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.doctor_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Full Covered By Insurance Company
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.full_covered_by_insurance_company ==
                                            1
                                                ? "Yes"
                                                : "No"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Received By
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.received_by}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Received Date
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {convertDate(payment.received_date)}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            Last Updated By
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5">
                                            {payment.updated_by
                                                ? payment.updated_by
                                                : "-"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th
                                            colSpan={4}
                                            className="border border-gray-200 px-3 py-1.5 bg-green-200"
                                        >
                                            Treatment Service Information By Patients
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                            Service Name
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                            Price
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                            Number
                                        </td>
                                        <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                            Total Price
                                        </td>
                                    </tr>

                                    {
                                        JSON.parse(payment.treatment).map((t,i) => (
                                            <tr key={i}>
                                                <td className="border border-gray-200 px-3 py-1.5">
                                                    {t.name}
                                                </td>
                                                <td className="border border-gray-200 px-3 py-1.5">
                                                    {"€ " + Number(t.price).toLocaleString("es-ES")}
                                                </td>
                                                <td className="border border-gray-200 px-3 py-1.5">
                                                    {t.number ? t.number : 1}
                                                </td>
                                                <td className="border border-gray-200 px-3 py-1.5">
                                                    {t.total_patient_price ? "€ " + Number(t.total_patient_price).toLocaleString("es-ES") : "€ " + Number(t.price).toLocaleString("es-ES")} 
                                                </td>
                                            </tr>
                                        ))
                                    }

                                    <tr>
                                        <td className="border border-gray-200 px-3 py-1.5 font-semibold text-center" colSpan={3}>
                                            Total + Service Charges ({"€ " + payment.charges})
                                        </td>
                                        
                                        <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                            {payment.full_covered_by_insurance_company == 1 ? "€ " + 0 : "€ " + calculateTotal()}
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th
                                        colSpan={4}
                                        className="border border-gray-200 px-3 py-1.5 bg-red-200"
                                    >
                                        Treatment Service Information By Insurance
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                        Service Name
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                        Price By Insurance
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                        Number
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                        Total Price
                                    </td>
                                </tr>

                                {
                                    JSON.parse(payment.treatment).map((t,i) => (
                                        <tr key={i}>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {t.name}
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {"€ " + Number(t.home_visit_price).toLocaleString("es-ES")}
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {t.number ? t.number : 1}
                                            </td>
                                            <td className="border border-gray-200 px-3 py-1.5">
                                                {t.total_insurance_price ? "€ " + Number(t.total_insurance_price).toLocaleString("es-ES") : "€ " + Number(t.home_visit_price).toLocaleString("es-ES")} 
                                            </td>
                                        </tr>
                                    ))
                                }

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5 font-semibold text-center" colSpan={3}>
                                        Total
                                    </td>
                                    
                                    <td className="border border-gray-200 px-3 py-1.5 font-semibold">
                                        { "€ " + calculateInsuranceTotal()}
                                    </td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <LoadingState />
            )}
        </>
    );
};

export default PaymentDetail;
