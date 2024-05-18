import {
    faEdit,
    faPlus,
    faTrashCan,
    faCircleInfo,
    faPrint,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../components/PrimaryButton";
import TextInput from "../../../components/TextInput";
import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import CreatePayment from "./CreatePayment";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import StatusLoading from "../../../components/Loading";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { ExportToExcel } from "./ExportToExcel";

const Payments = () => {
    const { user } = useAuthContext();
    const [paymentRecord, setPaymentRecord] = useState(null);
    const [patients, setPatients] = useState(null);
    const [therapist, setTherapist] = useState(null);

    const [dataToExport, setDataToExport] = useState([]);

    const [pagination, setPagination] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editModalData, setEditModalData] = useState(null);

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: "selection",
        },
    ]);

    const url = "/payment-record";

    const getData = async (url) => {
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
                setPaymentRecord(res.data.payment.data);
                setPagination(res.data.payment);
                setPatients(res.data.patient);
                setTherapist(res.data.therapist);

                const toExpot = res.data.payment.data.map((data, i) => ({
                    no: i + 1,
                    "patient name":
                        data.patient.title +
                        " " +
                        data.patient.first_name +
                        " " +
                        data.patient.last_name,
                    "date of birth": data.patient.dob,
                    address:
                        data.patient.house_number +
                        " " +
                        data.patient.street +
                        " " +
                        data.patient.city +
                        " " +
                        data.patient.postal_code,
                    "insurance company": data.patient.health_insurance_company,
                    "house doctor": data.patient.house_doctor,
                    "recommended doctor": data.patient.recommended_doctor,
                    "treatment in six months":
                        data.patient.treatment_in_6_month == 1 ? "Yes" : "No",
                    "issue date": data.issue_date,
                    treatment: data.treatment,
                    "doctor name": data.doctor_name,
                    "covered by insurance company":
                        data.full_covered_by_insurance_company == 1
                            ? "Yes"
                            : "No",
                    number: data.number,
                    cost: "€ " + data.cost,
                    "additional payment": data.additional_payment
                        ? "€ " + data.additional_payment
                        : "-",
                    "home visit": data.home_visit == 1 ? "Yes" : "No",
                    number2: data.number2,
                    cost3: "€ " + data.cost3,
                    "additional payment 4": data.additional_payment_4
                        ? "€ " + data.additional_payment_4
                        : "-",
                    "total payment": "€ " + data.total_payment,
                    "received by": data.received_by,
                    "received date": data.received_date,
                    remark: data.remark,
                }));

                setLoading(false);
                setDataToExport(toExpot);
            } else {
                console.log(error);
                setLoading(false);
            }
        } else {
            res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (res) {
                setPaymentRecord(res.data.payment.data);
                setPagination(res.data.payment);
                setPatients(res.data.patient);
                setTherapist(res.data.therapist);
                const toExpot = res.data.payment.data.map((data, i) => ({
                    no: i + 1,
                    "patient name":
                        data.patient.title +
                        " " +
                        data.patient.first_name +
                        " " +
                        data.patient.last_name,
                    "date of birth": data.patient.dob,
                    address:
                        data.patient.house_number +
                        " " +
                        data.patient.street +
                        " " +
                        data.patient.city +
                        " " +
                        data.patient.postal_code,
                    "insurance company": data.patient.health_insurance_company,
                    "house doctor": data.patient.house_doctor,
                    "recommended doctor": data.patient.recommended_doctor,
                    "treatment in six months":
                        data.patient.treatment_in_6_month == 1 ? "Yes" : "No",
                    "issue date": data.issue_date,
                    treatment: data.treatment,
                    "doctor name": data.doctor_name,
                    "covered by insurance company":
                        data.full_covered_by_insurance_company == 1
                            ? "Yes"
                            : "No",
                    number: data.number,
                    cost: "€ " + data.cost,
                    "additional payment": data.additional_payment
                        ? "€ " + data.additional_payment
                        : "-",
                    "home visit": data.home_visit == 1 ? "Yes" : "No",
                    number2: data.number2,
                    cost3: "€ " + data.cost3,
                    "additional payment 4": data.additional_payment_4
                        ? "€ " + data.additional_payment_4
                        : "-",
                    "total payment": "€ " + data.total_payment,
                    "received by": data.received_by,
                    "received date": data.received_date,
                    remark: data.remark,
                }));

                setLoading(false);
                setDataToExport(toExpot);
            } else {
                console.log(error);
                setLoading(false);
            }
        }
    };

    const handleCreate = (data) => {
        getData(url);
        Swal.fire({
            title: "Success!",
            text: "New Payment Record created successfully",
            icon: "success",
        });
    };

    const handleUpdate = (data) => {
        setService((prev) =>
            prev.map((p) => {
                if (p.id === data.id) {
                    return { ...p, ...data };
                } else {
                    return p;
                }
            })
        );
        Swal.fire({
            title: "Success!",
            text: "Service Updated successfully",
            icon: "success",
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#4B4A4A",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete",
            position: "top",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete("/payment-record/delete/" + id, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        if (response.data.status == "success") {
                            setPaymentRecord((prev) =>
                                prev.filter((p) => p.id !== id)
                            );
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };

    useEffect(() => {
        getData(url);
    }, [dateRange]);

    const handlePagination = (paginate_url) => {
        getData(paginate_url ?? url);
        window.scrollTo(0, 0);
    };

    return (
        <>
            <Header title="Payment Records" />

            <div className="flex md:flex-row flex-col md:justify-between justify-start gap-3 items-center mb-2">
                <div className="flex md:flex-row flex-col justify-normal items-center gap-3">
                    <ReactDatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                        dateFormat="yyyy/MM/dd"
                        isClearable={true}
                        showIcon
                        calendarIconClassname="react-date-range-picker"
                        className="bg-white h-[30px] rounded-md outline-none border border-slate-300 shadow-sm w-full cursor-pointer placeholder:text-sm placeholder:pl-1 focus:border-slate-400"
                        placeholderText=" Filter By Issue Date"
                    />

                    <TextInput
                        type="text"
                        placeholder="Search by Patient Name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="!py-1 !mt-0"
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <PrimaryButton onClick={() => setOpenCreateModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        <span>Add New Payment Record</span>
                    </PrimaryButton>

                    {paymentRecord && (
                        <ExportToExcel
                            apiData={dataToExport}
                            fileName={"payment_record"}
                        />
                    )}
                </div>
            </div>
            <table className="w-[32rem] sm:w-full rounded-lg">
                <thead className="bg-[#4b4a4a] uppercase text-white border">
                    <tr className="h-7">
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Patient Name
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            DOB
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Address
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Issue Date
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Received By
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Detail
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Print
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="text-slate-600">
                    {paymentRecord !== null ? (
                        paymentRecord
                            .filter(
                                (s) =>
                                    s.patient.first_name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                    s.patient.last_name
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                            )
                            .map((pr, i) => (
                                <tr className="text-[15px] font-normal" key={i}>
                                    <td className="border border-separate py-1 pl-2">
                                        {pr.patient.title}{" "}
                                        {pr.patient.first_name}{" "}
                                        {pr.patient.last_name}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {pr.patient.dob}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {pr.patient.street}
                                        {", "}
                                        {pr.patient.house_number}
                                        {", "}
                                        {pr.patient.city}
                                        {", "}
                                        {pr.patient.postal_code}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {pr.issue_date}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {pr.received_by}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        <Link
                                            to={`/app/payments/detail/${pr.id}`}
                                            className="flex justify-start items-center gap-1 text-xs bg-gray-700 px-2 py-[2px] w-fit rounded-md"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCircleInfo}
                                                className="text-amber-300"
                                            />
                                            <p className="text-slate-100">
                                                Detail
                                            </p>
                                        </Link>
                                    </td>
                                    <td className="border border-separate pl-2">
                                        <a
                                            href={`/app/payments/export/${pr.id}`}
                                            target="_blank"
                                            className="flex justify-start items-center gap-1 w-fit px-2 py-[2px] rounded-md bg-blue-300 text-xs"
                                        >
                                            <FontAwesomeIcon icon={faPrint} />
                                            <p>Pdf</p>
                                        </a>
                                    </td>
                                    <td className="border border-separate pl-2">
                                        <Link
                                            to={`/app/payments/edit/${pr.id}`}
                                        >
                                            <span className="pr-4 cursor-pointer">
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
                                            </span>
                                        </Link>
                                        <span className="cursor-pointer">
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                                className="text-rose-500"
                                                onClick={() =>
                                                    handleDelete(pr.id)
                                                }
                                            />
                                        </span>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan={7}>
                                <StatusLoading />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {pagination && (
                <Pagination onPaginate={handlePagination} data={pagination} />
            )}

            <CreatePayment
                show={openCreateModal}
                close={() => setOpenCreateModal(false)}
                maxWidth="w-full sm:w-5/6 md:w-2/3 mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                handleCreate={handleCreate}
                patient={patients}
                therapist={therapist}
            />
        </>
    );
};

export default Payments;
