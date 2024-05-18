import MetaTitle from "../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faCalendarCheck,
    faClipboard,
    faCoins,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "../../axios";
import useAuthContext from "../../context/AuthContext";
import StateLoading from "../../components/Loading";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [totalPatient, setTotalPatient] = useState(null);
    const [totalAppointment, setTotalAppointment] = useState(null);
    const [totalPaymentRecord, setTotalPaymentRecord] = useState(null);
    const [totalIncome, setTotalIncome] = useState(null);
    const [activeAppointment, setActiveAppointment] = useState(null);
    const [reservedDateTime, setReservedDateTime] = useState(null);

    const { user } = useAuthContext();

    const fetchData = () => {
        setLoading(true);
        axios
            .get("/dashboard", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                if (res.data.status == "success") {
                    setLoading(false);

                    setTotalPatient(res.data.totalPatient);
                    setTotalAppointment(res.data.totalAppointment);
                    setTotalPaymentRecord(res.data.totalPaymentRecord);
                    setTotalIncome(res.data.totalIncome);
                    setActiveAppointment(res.data.activeAppointment);
                    setReservedDateTime(res.data.reserved);
                }
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const convertDate = (date) => {
        let newDate = date.split("-");
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
    };

    const convertDate2 = (date) => {
        let getSplit = date.split(" ");
        let dateSplit = getSplit[0].split("-");
        let newDate =
            dateSplit[2] +
            "-" +
            dateSplit[1] +
            "-" +
            dateSplit[0] +
            " " +
            getSplit[1];

        return newDate;
    };

    if (loading) {
        return <StateLoading />;
    } else {
        return (
            <>
                <MetaTitle title="Dashboard" />
                <div className="flex md:flex-row flex-col md:justify-between justify-start gap-3 items-center mb-2">
                    <p className="text-slate-600 md:text-base text-sm">
                        Dashboard
                    </p>
                </div>

                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 items-center">
                    <div className="w-full">
                        <div className="flex flex-col gap-2 items-center justify-between p-2 rounded-md bg-amber-200 text-center drop-shadow-md">
                            <FontAwesomeIcon
                                icon={faUsers}
                                className="text-4xl text-gray-600"
                            />
                            <div className="text-slate-600">
                                <p className="text-base font-semibold">
                                    Total Patient
                                </p>
                                <p className="text-sm font-mono">
                                    {Number(totalPatient).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex flex-col gap-2 items-center justify-between p-2 rounded-md bg-cyan-200 text-center drop-shadow-md">
                            <FontAwesomeIcon
                                icon={faCalendarCheck}
                                className="text-4xl text-gray-600"
                            />
                            <div className="text-slate-600">
                                <p className="text-base font-semibold">
                                    Total Appoitment
                                </p>
                                <p className="text-sm font-mono">
                                    {Number(totalAppointment).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex flex-col gap-2 items-center justify-between p-2 rounded-md bg-blue-200 text-center drop-shadow-md">
                            <FontAwesomeIcon
                                icon={faClipboard}
                                className="text-4xl text-gray-600"
                            />
                            <div className="text-slate-600">
                                <p className="text-base font-semibold">
                                    Total Payment Record
                                </p>
                                <p className="text-sm font-mono">
                                    {Number(
                                        totalPaymentRecord
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex flex-col gap-2 items-center justify-between p-2 rounded-md bg-cyan-200 text-center drop-shadow-md">
                            <FontAwesomeIcon
                                icon={faCoins}
                                className="text-4xl text-gray-600"
                            />
                            <div className="text-slate-600">
                                <p className="text-base font-semibold">
                                    Total Income
                                </p>
                                <p className="text-sm font-mono">
                                    € {Number(totalIncome).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-start my-4">
                    <div className="w-full">
                        <p className="text-slate-600 text-sm border-b border-blue-100 mb-2">
                            Active Appointment Lists
                        </p>
                        <table className="w-full table-fixed">
                            <thead className="bg-[#4b4a4a] uppercase text-white border">
                                <tr className="h-7">
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Patient Name
                                    </th>

                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Therapist
                                    </th>

                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Doctor Name
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Date
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Time
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Created By
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 text-sm">
                                {activeAppointment ? (
                                    activeAppointment.map((data, i) => (
                                        <tr className="font-normal" key={i}>
                                            <td className="border border-separate py-1 pl-2">
                                                {data.patient.title}{" "}
                                                {data.patient.first_name}{" "}
                                                {data.patient.last_name}
                                            </td>
                                            <td className="border border-separate py-1 pl-2">
                                                {data.doctor_name}
                                            </td>

                                            <td className="border border-separate py-1 pl-2">
                                                {data.user.name}
                                            </td>
                                            <td className="border border-separate py-1 pl-2">
                                                {convertDate(data.date)}
                                            </td>
                                            <td className="border border-separate pl-2">
                                                {data.time}
                                            </td>
                                            <td className="border border-separate pl-2 font-mono">
                                                {data.created_by}
                                            </td>
                                            <td className="border border-separate pl-2">
                                                {convertDate2(
                                                    data.created_at.replace(
                                                        /T|.000000Z/gi,
                                                        " "
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="font-normal">
                                        <td
                                            colSpan={6}
                                            className="border border-separate py-1 pl-2"
                                        >
                                            No Data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full">
                        <p className="text-slate-600 text-sm border-b border-blue-100 mb-2">
                            Reserved Date Time (This Week)
                        </p>
                        <table className="w-full table-fixed">
                            <thead className="bg-rose-400 uppercase text-white border">
                                <tr className="h-7">
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Date
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        From
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        To
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Created By
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 text-sm">
                                {reservedDateTime ? (
                                    reservedDateTime.map((data, i) => (
                                        <tr className="font-normal" key={i}>
                                            <td className="border border-separate py-1 pl-2">
                                                {data.date}
                                            </td>
                                            <td className="border border-separate pl-2">
                                                {data.from_time}
                                            </td>
                                            <td className="border border-separate pl-2 font-mono">
                                                {data.to_time}
                                            </td>
                                            <td className="border border-separate pl-2">
                                                {data.created_by}
                                            </td>
                                            <td className="border border-separate pl-2">
                                                {convertDate2(
                                                    data.created_at.replace(
                                                        /T|.000000Z/gi,
                                                        " "
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="font-normal">
                                        <td
                                            colSpan={5}
                                            className="border border-separate py-1 pl-2"
                                        >
                                            No Data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    }
};

export default Dashboard;
