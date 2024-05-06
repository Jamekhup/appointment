import {
    faEdit,
    faPlus,
    faTrashCan,
    faCircleInfo,
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

const Patient = () => {
    const [patients, setPatients] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useAuthContext();

    const getPatients = () => {
        setLoading(true);
        axios
            .get("/patient", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                if (res.data.status == "success") {
                    setPatients(res.data.patients);
                    setLoading(false);
                    console.log(res);
                }
            });
    };

    useEffect(() => {
        getPatients();
    }, []);

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
                            getPatients();
                        }
                    });
            }
        });
    };

    return (
        <>
            <Header title="Patients" />
            <div className="flex justify-between items-center">
                <div className="font-serif font-medium text-lg">Patients</div>
                <div className="flex justify-end items-center gap-x-2 mb-1">
                    <NavLink to={"create"}>
                        <PrimaryButton>
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            <span>Add New Patient</span>
                        </PrimaryButton>
                    </NavLink>
                </div>
            </div>
            <table className="w-[32rem] sm:w-full rounded-lg">
                <thead className="bg-[#4b4a4a] uppercase text-white border">
                    <tr className="h-7">
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            No
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Full Name
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
                        patients.map((pa, i) => (
                            <tr className="text-[15px] font-normal" key={i}>
                                <td className="border border-separate py-1 pl-2">
                                    {i + 1}
                                </td>
                                <td className="border border-separate pl-2">
                                    {pa.first_name} {pa.last_name}
                                </td>
                                <td className="border border-separate pl-2">
                                    {pa.dob}
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
                                        <FontAwesomeIcon icon={faCircleInfo} />
                                        <span>Detail</span>
                                    </NavLink>
                                </td>
                                <td className="border border-separate pl-2">
                                    <NavLink to={"/app/patient/edit/" + pa.id}>
                                        <span className="pr-4 cursor-pointer">
                                            <FontAwesomeIcon icon={faEdit} />
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
        </>
    );
};

export default Patient;
