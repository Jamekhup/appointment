import MetaTitle from "../../components/MetaTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TextInput from "../../components/TextInput";
import PrimaryButton from "../../components/PrimaryButton";
import axios from "../../axios";
import useAuthContext from "../../context/AuthContext";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Setting = () => {
    const [getUser, setGetUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const navigate = useNavigate();

    const [showHidePassword, setShowHidePassword] = useState(false);
    
    const [errors, setErrors] = useState([]);
    const { user, setUser } = useAuthContext();

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');

    const fetchData = () =>{
        setLoading(true);
        axios
           .get("/setting/",{
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
 
           })
           .then((res) => {
                if(res.data.status == 'success'){
                    setGetUser(res.data.user);
                    setLoading(false);
                }
            })
           .catch((err) => {
                setErrors(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData();
    },[]);


    const togglePassword = () => {
        let pass = document.querySelectorAll('#password');
        if (password || currentPassword || passwordConfirmation) {
            pass.forEach((p) => {
                if (p.type === "password") {
                    p.type = "text";
                    setShowHidePassword(true);
                } else {
                    p.type = "password";
                    setShowHidePassword(false);
                }
            })
        }
    };
    

    const updatePassword = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setErrors([]);
        
        try {
            const res = await axios.post('/setting/update-password',{
                currentPassword,
                password,
                password_confirmation
            },{
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if(res.data.status === 'success') {
                
                setSubmitLoading(false);
                setPassword('');
                setPasswordConfirmation('');
                setCurrentPassword('');
                setUser(null);
                Cookies.remove("app_sys");
                navigate("/");
            }else{
                Swal.fire({
                    icon: 'error',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 4500
                })
                setSubmitLoading(false);
            }
            
        } catch (error) {
            setSubmitLoading(false);
            if (error.response.status == 422) {
                
                setErrors(
                    (pre) => [...pre, error.response.data.message.password]
                );
                console.log(errors);
            }
        }
    }


    return (
        <>
            <MetaTitle title="Setting" />

            {
                !loading && getUser ? (
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-start mt-4 mb-2 text-sm">
                        <div>
                            <p className="bg-slate-200 p-2 rounded-md mb-2">User Information</p>
                            <table className="w-full mt-4">
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2">
                                            User Name
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2">
                                            {getUser.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2">
                                            Email
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2">
                                            {getUser.email}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2">
                                            Account Create By
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2">
                                            {getUser.created_by ? getUser.created_by : '-'}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="border border-gray-100 px-3 py-2">
                                            Account Create At
                                        </td>
                                        <td className="border border-gray-100 px-3 py-2">
                                            {getUser.created_at.replace(/T|.000000Z/gi,' ')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <p className="bg-slate-200 p-2 rounded-md mb-2">Update Password</p>
                            <form onSubmit={updatePassword} className="mt-2">
                                <div className="flex flex-col gap-2.5 mb-2">
                                    <div className="flex flex-col text-sm relative">
                                        <label>Current Password</label>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Current Password"
                                            required
                                        />
                                        <FontAwesomeIcon
                                            icon={showHidePassword ? faEye : faEyeSlash}
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
                                        <label>New Password</label>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                        <label>Confirm New Password</label>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            value={password_confirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                ):(
                    <Loading/>
                )
            }
        </>
    );
};

export default Setting;
