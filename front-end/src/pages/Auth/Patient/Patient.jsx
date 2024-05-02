import { faEdit, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../components/PrimaryButton";
import { useState } from "react";

const Patient = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);

    return (
        <>
            <Header title="Patients" />
            <div className="font-serif font-medium text-lg">Patients</div>
            <div className="flex justify-end items-center gap-x-2 mb-1">
                <PrimaryButton>
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    <span>Create</span>
                </PrimaryButton>
            </div>
            <table className="w-[32rem] sm:w-full rounded-lg">
                <thead className="bg-[#4b4a4a] uppercase text-white border">
                    <tr className="h-7">
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            No
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Name
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            DOB
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Postal Code
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Recommend Dr
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Payment Free
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="text-slate-600">
                    <tr className="text-[15px] font-normal">
                        <td className="border border-separate py-1 pl-2">1.</td>
                        <td className="border border-separate pl-2">name</td>
                        <td className="border border-separate pl-2">
                            12/03/1998
                        </td>
                        <td className="border border-separate pl-2">345821</td>
                        <td className="border border-separate pl-2">
                            Dr.Johnny
                        </td>
                        <td className="border border-separate pl-2">yes</td>
                        <td className="border border-separate pl-2">
                            <span className="pr-4 cursor-pointer">
                                <FontAwesomeIcon icon={faEdit} />
                            </span>
                            <span className="cursor-pointer">
                                <FontAwesomeIcon
                                    icon={faTrashCan}
                                    className="text-rose-500"
                                />
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default Patient;
