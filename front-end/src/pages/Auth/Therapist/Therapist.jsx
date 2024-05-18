import { faEdit, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../../components/MetaTitle";
import PrimaryButton from "../../../components/PrimaryButton";
import { useEffect, useState } from "react";
import axios from "../../../axios";
import Swal from "sweetalert2";
import useAuthContext from "../../../context/AuthContext";
import CreateTherapist from "./CreateTherapist";
import EditTherapist from "./EditTherapist";
import Loading from "../../../components/Loading";
import TextInput from "../../../components/TextInput";

const Therapist = () => {
    const { user } = useAuthContext();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openEditModalData, setOpenEditModalData] = useState(null);

    const getData = () => {
        setLoading(true);
        axios
            .get("/therapist", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                setEmployee(response.data.employee);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const handleCreate = (data) => {
        setEmployee((prev) => [data, ...prev]);
    };

    const handleUpdate = (data) => {
        setEmployee((prev) =>
            prev.map((p) => {
                if (p.id === data.id) {
                    return { ...p, ...data };
                } else {
                    return p;
                }
            })
        );
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
                    .delete("/therapist/delete/" + id, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        setEmployee((prev) => prev.filter((p) => p.id !== id));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Header title="Therapist" />
            <div className="flex md:flex-row flex-col md:justify-between justify-start gap-3 items-center mb-2">
                <TextInput
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Employee by Name"
                    className="!py-1 md:w-[30%] w-full"
                />
                <div className="flex justify-end items-center gap-x-2">
                    <PrimaryButton onClick={() => setOpenCreateModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        <span>Add New Employee</span>
                    </PrimaryButton>
                </div>
            </div>
            <div className="overflow-x-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-[#4b4a4a] uppercase text-white border">
                        <tr className="h-7">
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                No
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Name
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Email
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Access
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Color
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {!loading ? (
                            employee &&
                            employee
                                .filter((s) =>
                                    s.name
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                                )
                                .map((emp, i) => (
                                    <tr
                                        className="text-[15px] font-normal"
                                        key={i}
                                    >
                                        <td className="border border-separate py-1 pl-2">
                                            {i + 1}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {emp.name}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            {emp.email}
                                        </td>
                                        <td className="border border-separate pl-2">
                                            <div className="flex justify-start flex-wrap gap-1 items-center text-xs my-1">
                                                {emp.dashboard_access == 1 && (
                                                    <span
                                                        className="bg-green-200 w-fit px-2 py-[1px] rounded-lg
                                                text-slate-600"
                                                    >
                                                        Dashboard
                                                    </span>
                                                )}

                                                {emp.appointment_access ==
                                                    1 && (
                                                    <span
                                                        className="bg-green-200 w-fit px-2 py-[1px] rounded-lg
                                                text-slate-600"
                                                    >
                                                        Appointment
                                                    </span>
                                                )}

                                                {emp.appointment_list_access ==
                                                    1 && (
                                                    <span
                                                        className="bg-green-200 w-fit px-2 py-[1px] rounded-lg
                                                text-slate-600"
                                                    >
                                                        Appointment List
                                                    </span>
                                                )}

                                                {emp.patient_access == 1 && (
                                                    <span
                                                        className="bg-green-200 w-fit px-2 py-[1px] rounded-lg
                                                text-slate-600"
                                                    >
                                                        Patient
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex justify-start flex-wrap gap-1 items-center text-xs my-1">
                                                {emp.payment_record_access ==
                                                    1 && (
                                                    <span
                                                        className="bg-green-200 w-fit px-2 py-[1px] rounded-lg
                                                text-slate-600"
                                                    >
                                                        Payment Record
                                                    </span>
                                                )}

                                                {emp.service_access == 1 && (
                                                    <span
                                                        className="bg-green-200 w-fit px-2 py-[1px] rounded-lg
                                                text-slate-600"
                                                    >
                                                        Service
                                                    </span>
                                                )}

                                                {emp.employee_access == 1 && (
                                                    <span
                                                        className="bg-green-200 w-fit px-2 py-[1px] rounded-lg
                                                text-slate-600"
                                                    >
                                                        Employee
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-separate pl-2">
                                            <div
                                                className="rounded-sm px-1 py-2 mr-2"
                                                style={{
                                                    backgroundColor: emp.color,
                                                }}
                                            ></div>
                                        </td>
                                        <td className="border border-separate pl-2">
                                            <span
                                                className="pr-4 cursor-pointer"
                                                title="Edit Employee"
                                                onClick={() => {
                                                    setOpenEditModal(true);
                                                    setOpenEditModalData(emp);
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
                                            </span>
                                            <span
                                                className="cursor-pointer"
                                                title="Delete Employee"
                                                onClick={() =>
                                                    handleDelete(emp.id)
                                                }
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
                                <td colSpan={5}>
                                    <Loading />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CreateTherapist
                show={openCreateModal}
                close={() => setOpenCreateModal(false)}
                maxWidth="w-full sm:w-5/6 md:w-2/3 mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                handleCreate={handleCreate}
            />

            {openEditModalData && (
                <EditTherapist
                    show={openEditModal}
                    close={() => {
                        setOpenEditModal(false);
                        setOpenEditModalData(null);
                    }}
                    maxWidth="w-full sm:w-5/6 md:w-2/3 mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                    editData={openEditModalData}
                    handleUpdate={handleUpdate}
                />
            )}
        </>
    );
}

export default Therapist