import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import MetaTitle from "../../components/MetaTitle";
import PrimaryButton from "../../components/PrimaryButton";
import TextInput from "../../components/TextInput";
const ResetPassword = () => {
    const { id } = useParams();

    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [showHidePassword, setshowHidePassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios
                .post("/reset-password-post/" + id, {
                    password,
                    password_confirmation,
                })
                .then((response) => {
                    if (response.data.status === "success") {
                        setSuccess(response.data.message);
                        setError("");
                        setLoading(false);
                    } else {
                        setLoading(false);
                        setError(response.data.message);
                        setSuccess("");
                    }
                });
        } catch (error) {
            if (error.response.status == 422) {
                setError(
                    error.response.data.message.password
                        ? error.response.data.message.password[0]
                        : null
                );
                setLoading(false);
                setSuccess("");
            }
        }
    };

    const togglePassword = () => {
        if (password || password_confirmation) {
            let pass = document.querySelectorAll("#password");
            if (pass[0].type === "password" && pass[1].type == "password") {
                pass[0].type = "text";
                pass[1].type = "text";
                setshowHidePassword(true);
            } else {
                pass[0].type = "password";
                pass[1].type = "password";
                setshowHidePassword(false);
            }
        }
    };

    return (
        <>
            <MetaTitle title="Reset Password" />
            <div className="bg-gradient-to-b from-cyan-400 to-cyan-900 min-h-screen font-roboto pt-12">
                <div className="w-11/12 sm:w-[85%] md:w-[70%] lg:w-[40%] m-auto bg-white rounded-md">
                    <div className="flex flex-col rounded-md">
                        <div className="mt-2 text-2xl font-semibold text-center text-slate-600">
                            Reset Account Password
                        </div>

                        <div className="flex flex-col mt-2 text-center">
                            <p className="text-sm text-slate-500">
                                Enter a new password for your account
                            </p>

                            {error && (
                                <p className="mt-3 bg-red-300 text-red-600 px-2 py-1 rounded-md text-center text-sm mx-8">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="mt-3 bg-green-300 text-slate-600 px-2 py-1 rounded-md text-center text-sm mx-8">
                                    Your password has been reset successfully.{" "}
                                    <Link
                                        className="text-blue-400 font-bold underline"
                                        to="login"
                                    >
                                        {" "}
                                        Login Here
                                    </Link>
                                </p>
                            )}
                        </div>

                        <form
                            className="w-full px-8 py-4 mt-1"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <label className="text-sm text-gray-600">
                                        New Password
                                    </label>
                                    <TextInput
                                        type="password"
                                        required
                                        id="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="New Password"
                                    />
                                    <FontAwesomeIcon
                                        icon={
                                            showHidePassword
                                                ? faEye
                                                : faEyeSlash
                                        }
                                        className="absolute top-10 right-2 text-sm text-slate-500 cursor-pointer"
                                        onClick={() => togglePassword()}
                                    />
                                </div>

                                <div className="">
                                    <label className="text-sm text-gray-600">
                                        Confirm Password
                                    </label>
                                    <TextInput
                                        type="password"
                                        required
                                        id="password"
                                        value={password_confirmation}
                                        onChange={(e) =>
                                            setPasswordConfirmation(
                                                e.target.value
                                            )
                                        }
                                        className="w-full"
                                        placeholder="Confirm New Password"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <PrimaryButton
                                    type="button"
                                    disabled
                                    className="block w-full text-center mx-auto mt-4 animate-pulse"
                                >
                                    Resetting..
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton
                                    type="submit"
                                    className="block w-full text-center mx-auto mt-4"
                                >
                                    Reset Password
                                </PrimaryButton>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
