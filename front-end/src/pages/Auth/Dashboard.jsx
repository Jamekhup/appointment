import MetaTitle from "../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faCalendarCheck,
    faClipboard,
    faCoins,
    faCalendarDays,
    faUserNurse,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "../../axios";
import useAuthContext from "../../context/AuthContext";
import StateLoading from "../../components/Loading";
import ReactDatePicker from "react-datepicker";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [totalPatient, setTotalPatient] = useState(null);
    const [totalAppointment, setTotalAppointment] = useState(null);
    const [totalPaymentRecord, setTotalPaymentRecord] = useState(null);
    const [totalIncome, setTotalIncome] = useState(null);
    const [activeAppointment, setActiveAppointment] = useState(null);
    const [reservedDateTime, setReservedDateTime] = useState(null);

    const [therapists, setTherapists] = useState(null);
    const [yourAppointment, setYourAppointment] = useState(null);

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [filterTotalPatient, setFilterTotalPatient] = useState(null);
    const [filterTotalAppointment, setFilterTotalAppointment] = useState(null);
    const [filterTotalPaymentRecord, setFilterTotalPaymentRecord] =
        useState(null);
    const [filterTotalIncome, setFilterTotalIncome] = useState(null);

    const { user } = useAuthContext();

    const url = "/dashboard";

    const fetchData = async (url) => {
        setLoading(true);

        let res = null;

        if (startDate && endDate) {
            res = await axios.get(url, {
                params: { dateRange: dateRange },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (res) {
                setLoading(false);

                setTotalPatient(res.data.totalPatient);
                setTotalAppointment(res.data.totalAppointment);
                setTotalPaymentRecord(res.data.totalPaymentRecord);
                setTotalIncome(res.data.totalIncome);
                setActiveAppointment(res.data.activeAppointment);
                setReservedDateTime(res.data.reserved);

                setTherapists(res.data.therapists);
                setYourAppointment(res.data.yourAppointments);

                setFilterTotalPatient(res.data.filterTotalPatient);
                setFilterTotalAppointment(res.data.filterTotalAppointment);
                setFilterTotalPaymentRecord(res.data.filterTotalPaymentRecord);
                setFilterTotalIncome(res.data.filterTotalIncome);
            }
        } else {
            res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (res) {
                setLoading(false);

                setTotalPatient(res.data.totalPatient);
                setTotalAppointment(res.data.totalAppointment);
                setTotalPaymentRecord(res.data.totalPaymentRecord);
                setTotalIncome(res.data.totalIncome);
                setActiveAppointment(res.data.activeAppointment);
                setReservedDateTime(res.data.reserved);

                setTherapists(res.data.therapists);
                setYourAppointment(res.data.yourAppointments);

                setFilterTotalPatient(res.data.filterTotalPatient);
                setFilterTotalAppointment(res.data.filterTotalAppointment);
                setFilterTotalPaymentRecord(res.data.filterTotalPaymentRecord);
                setFilterTotalIncome(res.data.filterTotalIncome);
            }
        }
    };

    useEffect(() => {
        fetchData(url);
    }, [endDate]);

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

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: "selection",
        },
    ]);

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
                                    Total Appointment
                                </p>
                                <p className="text-sm font-mono">
                                    {Number(totalAppointment).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {(user && user.role == 0) || user.role == 1 ? (
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
                    ) : (
                        <div className="w-full">
                            <div className="flex flex-col gap-2 items-center justify-between p-2 rounded-md bg-blue-200 text-center drop-shadow-md">
                                <FontAwesomeIcon
                                    icon={faCalendarDays}
                                    className="text-4xl text-gray-600"
                                />
                                <div className="text-slate-600">
                                    <p className="text-base font-semibold">
                                        Total Appointment of Yours
                                    </p>
                                    <p className="text-sm font-mono">
                                        {Number(
                                            yourAppointment
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {(user && user.role == 0) || user.role == 1 ? (
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
                    ) : (
                        <div className="w-full">
                            <div className="flex flex-col gap-2 items-center justify-between p-2 rounded-md bg-cyan-200 text-center drop-shadow-md">
                                <FontAwesomeIcon
                                    icon={faUserNurse}
                                    className="text-4xl text-gray-600"
                                />
                                <div className="text-slate-600">
                                    <p className="text-base font-semibold">
                                        Therapist
                                    </p>
                                    <p className="text-sm font-mono">
                                        {Number(therapists).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {user && (user.role == 0 || user.role == 1) ? (
                    <div className="w-full mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <ReactDatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        setDateRange(update);
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    isClearable={true}
                                    showIcon
                                    calendarIconClassname="react-date-range-picker"
                                    className="bg-white h-[30px] rounded-md outline-none border border-slate-300 shadow-sm w-full cursor-pointer placeholder:text-sm placeholder:pl-1 focus:border-slate-400"
                                    placeholderText=" Filter By Date"
                                />
                            </div>
                            <div>
                                {startDate == null && endDate == null ? (
                                    <p className="text-slate-600 text-sm">
                                        Today Data
                                    </p>
                                ) : (
                                    <p className="text-slate-600 text-sm">
                                        {/* from {dateRange[0]} to {dateRange[1]} */}
                                    </p>
                                )}
                            </div>
                        </div>
                        <table className="w-full table-fixed">
                            <thead className="bg-cyan-400 uppercase text-white border">
                                <tr className="h-7">
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Patients
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Appointments
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Payment Records
                                    </th>
                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                        Income
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 text-sm">
                                {!loading ? (
                                    <tr className="font-normal">
                                        <td className="border border-separate py-1 pl-2">
                                            {filterTotalPatient &&
                                                filterTotalPatient}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {filterTotalAppointment &&
                                                filterTotalAppointment}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {filterTotalPaymentRecord &&
                                                filterTotalPaymentRecord}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            €{" "}
                                            {filterTotalIncome &&
                                                filterTotalIncome}
                                        </td>
                                    </tr>
                                ) : (
                                    <tr className="font-normal">
                                        <td
                                            colSpan={4}
                                            className="border border-separate py-1 pl-2 text-center"
                                        >
                                            No Data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : null}

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-start my-6">
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
                                {activeAppointment &&
                                activeAppointment.length > 0 ? (
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
                                            colSpan={7}
                                            className="border border-separate py-1 pl-2 text-center"
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
                                {reservedDateTime &&
                                reservedDateTime.length > 0 ? (
                                    reservedDateTime.map((data, i) => (
                                        <tr className="font-normal" key={i}>
                                            <td className="border border-separate py-1 pl-2">
                                                {convertDate(data.date)}
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
                                            className="border border-separate py-1 pl-2 text-center"
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
