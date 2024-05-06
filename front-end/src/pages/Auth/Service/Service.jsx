import { faEdit, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../../components/MetaTitle";
import PrimaryButton from "../../../components/PrimaryButton";
import { useEffect, useState } from "react";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import CreateService from "./CreateService";
import EditService from "./EditService";

const Service = () => {
    const { user } = useAuthContext();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editModalData, setEditModalData] = useState(null);

    const getData = () => {
        setLoading(true);
        axios
            .get("/service", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                setService(response.data.services);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const handleCreate = (data) => {
        setService((prev) => [data, ...prev]);
        Swal.fire({
            title: "Success!",
            text: "New Service created successfully",
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
            text: "New Service Updated successfully",
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
                    .delete("/service/delete/" + id, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        setService((prev) => prev.filter((p) => p.id !== id));
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
            <Header title="Service" />
            <div className="flex justify-between items-center">
                <div className="font-serif font-medium text-lg">Services</div>
                <div className="flex justify-end items-center gap-x-2 mb-1">
                    <PrimaryButton onClick={() => setOpenCreateModal(true)}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        <span>Add New Service</span>
                    </PrimaryButton>
                </div>
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
                                Price
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Description
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600 text-sm">
                        {!loading ? (
                            service?.map((ser, i) => (
                                <tr className="text-[15px] font-normal" key={i}>
                                    <td className="border border-separate py-1 pl-2">
                                        {i + 1}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {ser.name}
                                    </td>
                                    <td className="border border-separate pl-2 font-mono">
                                        {ser.price ? "DDK " + ser.price : "-"}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        {ser.description
                                            ? ser.description
                                            : "-"}
                                    </td>
                                    <td className="border border-separate pl-2">
                                        <span
                                            className="pr-4 cursor-pointer"
                                            title="Edit Employee"
                                            onClick={() => {
                                                setOpenEditModal(true);
                                                setEditModalData(ser);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </span>
                                        <span
                                            className="cursor-pointer"
                                            title="Delete Employee"
                                            onClick={() => handleDelete(ser.id)}
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

            <CreateService
                show={openCreateModal}
                close={() => setOpenCreateModal(false)}
                maxWidth="w-full sm:w-5/6 md:w-2/3 mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                handleCreate={handleCreate}
            />

            {openEditModal && (
                <EditService
                    show={openEditModal}
                    close={() => {
                        setOpenEditModal(false);
                        setEditModalData(null);
                    }}
                    maxWidth="w-full sm:w-5/6 md:w-2/3 mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                    editData={editModalData}
                    handleUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default Service;
