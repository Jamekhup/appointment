import { faEdit, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../../components/MetaTitle";
import PrimaryButton from "../../../components/PrimaryButton";
import { useEffect, useState } from "react";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import CreateEmployee from "./CreateEmployee";
import EditEmployee from "./EditEmployee";

const Employee = () => {
    const { user } = useAuthContext();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openEditModalData, setOpenEditModalData] = useState(null);

    const getData = () => {
        setLoading(true);
        axios
            .get("/employee", {
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
        setLoading(true);
        axios
            .delete("/employee/delete/" + id, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                setEmployee((prev) => prev.filter((p) => p.id !== id));
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Header title="Employee" />
            <div className="font-serif font-medium text-lg">Employee</div>
            <div className="flex justify-end items-center gap-x-2 mb-1">
                <PrimaryButton onClick={() => setOpenCreateModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    <span>Create</span>
                </PrimaryButton>
            </div>
            <div className="w-full overflow-auto">
                <table className="w-full">
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
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {!loading &&
                            employee?.map((emp, i) => (
                                <tr className="text-[15px] font-normal" key={i}>
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
                                        <span
                                            className="pr-4 cursor-pointer"
                                            title="Edit Employee"
                                            onClick={() => {
                                                setOpenEditModal(true);
                                                setOpenEditModalData(emp);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </span>
                                        <span
                                            className="cursor-pointer"
                                            title="Delete Employee"
                                            onClick={() => handleDelete(emp.id)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                                className="text-rose-500"
                                            />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <CreateEmployee
                show={openCreateModal}
                close={() => setOpenCreateModal(false)}
                maxWidth="w-full sm:w-5/6 md:w-2/3 mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                handleCreate={handleCreate}
            />

            {openEditModalData && (
                <EditEmployee
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
};

export default Employee;
