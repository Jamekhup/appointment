import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../components/PrimaryButton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import LoadingState from "../../../components/Loading";

const AppointmentDetail = () => {
    const { id } = useParams();
    const { user } = useAuthContext();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = () => {
        setLoading(true);

        try {
            axios
                .get(`/appointment/detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    if (res.data.status == "success") {
                        setLoading(false);
                        setAppointment(res.data.data);
                    }

                    if (res.data.status == "fail") {
                        navigate("/app/list");
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
    return (
        <>
            <Header title="Appointment Detail" />
            <div className="flex justify-between items-center text-sm">
                <PrimaryButton
                    className="flex gap-1 items-center "
                    onClick={() => window.history.back()}
                >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                    <p>Back</p>
                </PrimaryButton>
                <p>Appointment Detail</p>
            </div>

            {!loading && appointment ? (
                <div className="grid md:grid-cols-2 grid-cols-1 items-start gap-4 mt-6 mb-2 text-sm">
                    <div>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        Patient Name
                                    </td>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        {appointment.patient.title}{" "}
                                        {appointment.patient.first_name}{" "}
                                        {appointment.patient.last_name}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        Date Of Birth
                                    </td>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        {appointment.patient.dob}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        Address
                                    </td>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        {appointment.patient.street}
                                        {", "}
                                        {appointment.patient.house_number}
                                        {", "}
                                        {appointment.patient.city}
                                        {", "}
                                        {appointment.patient.postal_code}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        House Doctor
                                    </td>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        {appointment.patient.house_doctor
                                            ? appointment.patient.house_doctor
                                            : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        Recommended Doctor
                                    </td>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        {appointment.patient.recommended_doctor
                                            ? appointment.patient
                                                  .recommended_doctor
                                            : "-"}
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
                                        Service
                                    </td>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        {appointment.service.name}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        Price
                                    </td>
                                    <td className="border-b border-gray-200 px-3 py-1.5 font-mono">
                                        {appointment.service.price}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        Description
                                    </td>
                                    <td className="border-b border-gray-200 px-3 py-1.5">
                                        {appointment.service.description}
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

export default AppointmentDetail;
