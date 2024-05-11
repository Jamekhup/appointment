import Header from "../../../components/MetaTitle";
import axios from "../../../axios";
import useAuthContext from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

const AppointmentList = () => {
    return (
        <>
            <Header title="Appointment List"/>
            <div className="flex md:flex-row flex-col md:justify-between justify-start gap-3 items-center mb-2">
                <p>Appointment Lists</p>
            </div>

            <div className="overflow-x-hidden">
                <table className="w-full table-auto">
                    <thead className="bg-[#4b4a4a] uppercase text-white border">
                        <tr className="h-7">
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Date
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Time From
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Time To
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Status
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Created By
                            </th>
                            <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                Last Updated By
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        
                        <tr
                            className="text-[15px] font-normal"
                        >
                            <td className="border border-separate py-1 pl-2">
                                dsfsd
                            </td>
                            <td className="border border-separate pl-2">
                                sdfsd
                            </td>
                                
                            <td className="border border-separate pl-2">
                                sdfsd
                            </td>
                            <td className="border border-separate pl-2">
                                sdfsad
                            </td>
                            <td className="border border-separate pl-2">
                                sadfsdf
                            </td>
                            <td className="border border-separate pl-2">
                                sadfsdf
                            </td>
                        </tr>
                               
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AppointmentList;
