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
                                        Treatment
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        {payment.treatment}
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
                                        Number
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        {payment.number}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        Cost
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        € {payment.cost}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        Additional Payment
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        {payment && payment.additional_payment
                                            ? "€ " + payment.additional_payment
                                            : "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        Home Visit
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        {payment.home_visit == 1 ? "Yes" : "No"}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        Number 2
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        {payment.number2
                                            ? payment.number2
                                            : "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        Cost 3
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        {payment.cost3
                                            ? "€ " + payment.cost3
                                            : "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        Additional Payment 4
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        {payment.additional_payment_4
                                            ? "€ " +
                                              payment.additional_payment_4
                                            : "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        Today Payment
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        € {payment.total_payment}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        Remark
                                    </td>
                                    <td className="border border-gray-200 px-3 py-1.5">
                                        {payment.remark ? payment.remark : "-"}
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
                    </div>
                </div>
            ) : (
                <LoadingState />
            )}
        </>
    );
};

export default PaymentDetail;
