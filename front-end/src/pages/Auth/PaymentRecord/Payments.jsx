import { faEdit, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../components/PrimaryButton";
import { useState } from "react";

const Payments = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);

    return (
        <>
            <Header title="Payment Records" />
            <div className="font-serif font-medium text-lg">
                Payment Records
            </div>
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
                            Date
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Title
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Name
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            HIC
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Treatment
                        </th>
                        <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="text-slate-600">
                    <tr className="text-[15px] font-normal">
                        <td className="border border-separate py-1 pl-2">
                            20/04/2023
                        </td>
                        <td className="border border-separate pl-2">Mr</td>
                        <td className="border border-separate pl-2">name</td>
                        <td className="border border-separate pl-2">BARMER</td>
                        <td className="border border-separate pl-2">
                            Physiotherapy
                        </td>
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

export default Payments;
