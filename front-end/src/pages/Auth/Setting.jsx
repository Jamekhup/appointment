import MetaTitle from "../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye,faEdit } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TextInput from "../../components/TextInput";
import PrimaryButton from "../../components/PrimaryButton";
import axios from "../../axios";
import useAuthContext from "../../context/AuthContext";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CreateCharges from "./Charges/CreateCharges";
import EditCharges from "./Charges/EditCharges";


const Setting = () => {
    const [getUser, setGetUser] = useState(null);
    const [getCharges, setGetCharges] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [createdDate, setCreatedDate] = useState(null);

    const navigate = useNavigate();

    const [showHidePassword, setShowHidePassword] = useState(false);

    const [errors, setErrors] = useState([]);
    const { user, setUser } = useAuthContext();

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");

    //for service charges
    const [addServiceChargesModal, setAddServiceChargesModal] = useState(false);
    const [editServiceChargesModal, setEditServiceChargesModal] = useState(false);

    const fetchData = () => {
        setLoading(true);
        axios
            .get("/setting", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => {
                if (res.data.status == "success") {
                    setGetUser(res.data.user);
                    setGetCharges(res.data.charges);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setErrors(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const togglePassword = () => {
        let pass = document.querySelectorAll("#password");
        if (password || currentPassword || password_confirmation) {
            pass.forEach((p) => {
                if (p.type === "password") {
                    p.type = "text";
                    setShowHidePassword(true);
                } else {
                    p.type = "password";
                    setShowHidePassword(false);
                }
            });
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors([]);

        try {
            const res = await axios.post(
                "/setting/update-password",
                {
                    currentPassword,
                    password,
                    password_confirmation,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            if (res.data.status === "success") {
                setSubmitLoading(false);
                setPassword("");
                setPasswordConfirmation("");
                setCurrentPassword("");
                setUser(null);
                Cookies.remove("app_sys");
                navigate("/");
            } else {
                Swal.fire({
                    icon: "error",
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 4500,
                });
                setSubmitLoading(false);
            }
        } catch (error) {
            setSubmitLoading(false);
            if (error.response.status == 422) {
                setErrors((pre) => [
                    ...pre,
                    error.response.data.message.password,
                ]);
                console.log(errors);
            }
        }
    };

    const convertDate = (date) => {
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

    const handleCreate = (data) => {
        fetchData();
        Swal.fire({
            title: "Success!",
            text: "Service Charges Added!",
            icon: "success",
        });
    };

    return (
        <>
            <MetaTitle title="Setting" />

            {!loading && getUser ? (
                
                <>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-start mt-4 mb-2 text-sm">
                        <div>
                            <p className="bg-slate-200 p-2 rounded-md mb-2">
                                User Information
                            </p>
                            <table className="w-full mt-4">
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            User Name
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            {getUser.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            Email
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            {getUser.email}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            Role
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            {getUser.role == 0 && "Super Admin"}
                                            {getUser.role == 1 && "Admin"}
                                            {getUser.role == 2 && "Therapist"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            Account Created By
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            {getUser.created_by
                                                ? getUser.created_by
                                                : "-"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            Account Created At
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2.5">
                                            {convertDate(
                                                getUser.created_at.replace(
                                                    /T|.000000Z/gi,
                                                    " "
                                                )
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <p className="bg-slate-200 p-2 rounded-md mb-2">
                                Update Password
                            </p>
                            <form onSubmit={updatePassword} className="mt-2">
                                <div className="flex flex-col gap-2.5 mb-2">
                                    <div className="flex flex-col text-sm relative">
                                        <label>
                                            Current Password{" "}
                                            <span className="text-red-600">*</span>
                                        </label>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) =>
                                                setCurrentPassword(e.target.value)
                                            }
                                            placeholder="Current Password"
                                            required
                                        />
                                        <FontAwesomeIcon
                                            icon={
                                                showHidePassword
                                                    ? faEye
                                                    : faEyeSlash
                                            }
                                            className="absolute top-9 right-2 text-sm text-slate-500 cursor-pointer"
                                            onClick={() => togglePassword()}
                                        />
                                        {errors && errors.currentPassword && (
                                            <div className="text-xs mt-1 font-medium text-red-600">
                                                {errors.currentPassword[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col text-sm">
                                        <label>
                                            New Password{" "}
                                            <span className="text-red-600">*</span>
                                        </label>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="New Password"
                                            required
                                        />
                                        {errors && (
                                            <div className="text-xs mt-1 font-medium text-red-600">
                                                {errors}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col text-sm">
                                        <label>
                                            Confirm New Password{" "}
                                            <span className="text-red-600">*</span>
                                        </label>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            value={password_confirmation}
                                            onChange={(e) =>
                                                setPasswordConfirmation(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Confirm New Password"
                                            required
                                        />
                                        {errors && errors.passwordConfirmation && (
                                            <div className="text-xs mt-1 font-medium text-red-600">
                                                {errors.passwordConfirmation[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <PrimaryButton
                                    type={submitLoading ? "button" : "submit"}
                                    className=" px-4 mt-2"
                                >
                                    {submitLoading ? "Updating..." : "Update"}
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-start mt-8 mb-2 text-sm">
                        <div>
                            <div className="bg-slate-200 p-2 rounded-md mb-2 flex justify-between items-center">
                                <p>Service Charges</p>

                                {getCharges == null && (
                                    <PrimaryButton className="!py-2 !px-2 active:bg-blue-300 focus:bg-blue-300 
                                    bg-blue-200 hover:bg-blue-300 !text-slate-500"
                                    onClick={() => setAddServiceChargesModal(true)}
                                    >
                                        Add Service Charges
                                    </PrimaryButton>
                                )}
                            </div>

                            {
                                getCharges && (
                                    <div className="relative overflow-y-auto">
                                        <table className="w-[32rem] sm:w-full rounded-lg">
                                            <thead className="bg-[#4b4a4a] uppercase text-white border">
                                                <tr className="h-7">
                                                    
                                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                        Amount
                                                    </th>
                                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                        Created By
                                                    </th>
                                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                        Updated By
                                                    </th>
                                                    
                                                    <th className="border border-separate text-left pl-2 font-normal text-[11.8px]">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-slate-600">
                                               
                                                <tr className="text-[15px] font-normal">
                                                    
                                                    <td className="border border-separate pl-2">
                                                        { "€ " + getCharges.amount}
                                                    </td>
                                                    <td className="border border-separate py-1 pl-2">
                                                        {getCharges.created_by}
                                                    </td>
                                                    <td className="border border-separate pl-2">
                                                        {getCharges.updated_by ? getCharges.updated_by : '-'}
                                                    </td>
                                                    
                                                    <td className="border border-separate pl-2">
                                                        <div onClick={() => setEditServiceChargesModal(true)}>
                                                            <span className="pr-4 cursor-pointer">
                                                                <FontAwesomeIcon
                                                                    icon={faEdit}
                                                                />
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            }

                        </div>
                        <div></div>
                    </div>
                    
                    {/* add service charges modal */}
                    {
                        addServiceChargesModal && (
                            <CreateCharges
                                show={addServiceChargesModal}
                                close={() => setAddServiceChargesModal(false)}
                                maxWidth="w-full sm:w-[50%] md:w-[30%] mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                                handleCreate={handleCreate}
                                
                            />
                        )
                    }

                    {
                        editServiceChargesModal && (
                            <EditCharges
                                show={editServiceChargesModal}
                                close={() => setEditServiceChargesModal(false)}
                                maxWidth="w-full sm:w-[50%] md:w-[30%] mt-10 mt-0 md:-mt-20 lg:-mt-28 xl:-mt-52"
                                data={getCharges}
                                handleUpdate={handleCreate}
                                
                            />
                        )
                    }
                </>

            ) : (
                <Loading />
            )}
        </>
    );
};

export default Setting;
