import {
    faEdit,
    faPlus,
    faTrashCan,
    faCircleInfo,
    faFileExcel
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../components/PrimaryButton";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import TextInput from "../../../components/TextInput";
import Pagination from "../../../components/Pagination";
import ExcelImport from "./ExcelImport";

const Patient = () => {
    const [patients, setPatients] = useState(null);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState("");

    const { user } = useAuthContext();

    const url = "/patient";

    const getPatients = (url) => {
        setLoading(true);
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                if (res.data.status == "success") {
                    setPatients(res.data.patients.data);
                    setPagination(res.data.patients);
                    setLoading(false);
                }
            });
    };

    useEffect(() => {
        getPatients(url);
    }, []);

    const handlePagination = (paginate_url) => {
        getPatients(paginate_url ?? url);
        window.scrollTo(0, 0);
    };

    const deletePatient = (id) => {
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
                setLoading(true);
                axios
                    .delete(`/patient/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((res) => {
                        if (res.data.status == "success") {
                            setLoading(false);
                            getPatients(url);
                        }
                    })
                    .catch(() => {
                        setLoading(false);
                    });
            }
        });
    };

    const convertDate = (date) => {
        let newDate = date.split("-");
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
    };

    //handle excel popup and upload
    const [toggleExcel, setToggleExcel] = useState(false);
    const handleExcelCreate = (data) => {
        Swal.fire({
            title: "Success!",
            text: "Patient List imported Successfully!",
            icon: "success",
        })
    }

    return (
        <>
            <Header title="Patients" />
            <div className="flex md:flex-row flex-col md:justify-between justify-start gap-3 items-center md:mb-0 mb-2">
                <TextInput
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Patient by Name"
                    className="!py-2 md:w-[30%] w-full mb-2"
                />
                <div className="flex md:flex-row flex-col gap-y-2 items-center justify-end gap-x-2">

                    <div>
                        <NavLink to={"create"}>
                            <PrimaryButton>
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                <span>Add New Patient</span>
                            </PrimaryButton>
                        </NavLink>
                    </div>
                    
                    <div>
                        <button
                            className="inline-flex items-center justify-end px-4 py-2 bg-blue-400 border border-transparent rounded-md
                            font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-300 focus:bg-blue-300
                            focus:outline-none focus:ring-0 focus:ring-blue-400 focus:ring-offset-2 transition ease-in-out
                            duration-150 "
                            onClick={() => setToggleExcel(true)}
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            <span>Excel Import</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="relative overflow-y-auto">
                <table className="w-full rounded-lg">
                    <thead className="bg-[#4b4a4a] uppercase text-white border">
                        <tr className="h-7">
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                No
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Full Name
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Email
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Phone
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                DOB
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Address
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Detail
                            </th>

                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {!loading ? (
                            patients &&
                            patients
                                .filter(
                                    (s) =>
                                        s.first_name
                                            .toLowerCase()
                                            .includes(search.toLowerCase()) ||
                                        s.last_name
                                            .toLowerCase()
                                            .includes(search.toLowerCase())
                                )
                                .map((pa, i) => (
                                    <tr className="text-[15px] font-normal" key={i}>
                                        <td className="border border-separate py-1 pl-2">
                                            {i + 1}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {pa.first_name} {pa.last_name}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {pa.email} 
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {pa.phone} 
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {convertDate(pa.dob)}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {pa.street + ", "}
                                            {pa.house_number + ", "}
                                            {pa.city + ", "}
                                            {pa.postal_code}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            <NavLink
                                                to={"/app/patient/detail/" + pa.id}
                                                className="flex justify-start items-center gap-1
                                        bg-amber-300 rounded-md px-2 py-[1px] w-fit text-xs"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCircleInfo}
                                                />
                                                <span>Detail</span>
                                            </NavLink>
                                        </td>
                                        <td className="border border-separate pl-2">
                                            <NavLink
                                                to={"/app/patient/edit/" + pa.id}
                                            >
                                                <span className="pr-4 cursor-pointer">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                    />
                                                </span>
                                            </NavLink>
                                            <span
                                                className="cursor-pointer"
                                                onClick={() => deletePatient(pa.id)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                    className="text-rose-500"
                                                />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    <Loading />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <Pagination onPaginate={handlePagination} data={pagination} />
            )}


            <ExcelImport 
                show={toggleExcel}
                close={() => setToggleExcel(false)}
                maxWidth="w-full sm:w-[55%] md:w-[30%] mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                handleCreate={handleExcelCreate}
            />
        </>
    );
};

export default Patient;
