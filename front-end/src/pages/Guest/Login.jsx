import { useNavigate } from "react-router-dom";
import useAuthContext from "../../context/AuthContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import MetaTitle from "../../components/MetaTitle";
import PrimaryButton from "../../components/PrimaryButton";
import TextInput from "../../components/TextInput";
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showHidePassword, setShowHidePassword] = useState(false);

    const { login, error, loading, user } = useAuthContext();

    const handleLogin = (e) => {
        e.preventDefault();
        login({ email, password });
    };

    const togglePassword = () => {
        let pass = document.getElementById("password");
        if (password) {
            if (pass.type === "password") {
                pass.type = "text";
                setShowHidePassword(true);
            } else {
                pass.type = "password";
                setShowHidePassword(false);
            }
        }
    };

    return (
        <>
            <MetaTitle title="Login" />
            <div className="bg-gradient-to-b from-cyan-400 to-cyan-900 min-h-screen font-roboto pt-12">
                <div className="w-11/12 sm:w-[85%] md:w-[70%] lg:w-[40%] m-auto bg-white rounded-md">
                    <div className="rounded-md">
                        <form
                            className="w-full text-center px-8 py-4"
                            onSubmit={handleLogin}
                        >
                            <div className="mt-2 lg:mt-6 text-2xl font-semibold">
                                Welcome Back!
                            </div>

                            {error && (
                                <p className="text-sm w-full p-1 bg-red-400 text-center rounded-md text-slate-200 mt-2">
                                    {error}
                                </p>
                            )}

                            <div className="flex flex-col mt-4 lg:mt-8">
                                <label className="text-left font-medium text-sm text-gray-600">
                                    Email Address
                                </label>
                                <TextInput
                                    type="email"
                                    placeholder="example@gmail.com"
                                    required
                                    autoFocus
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                {error && error.email && (
                                    <p className="text-sm text-left w-full p-1 text-red-400">
                                        {error.email}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col mt-3 lg:mt-4 relative">
                                <label className="text-left text-sm font-medium text-gray-600">
                                    Password
                                </label>
                                <TextInput
                                    id="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    required
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    value={password}
                                />

                                <FontAwesomeIcon
                                    icon={showHidePassword ? faEye : faEyeSlash}
                                    className="absolute top-9 right-2 text-sm text-slate-500 cursor-pointer"
                                    onClick={() => togglePassword()}
                                />

                                {error && error.password && (
                                    <p className="text-sm text-left w-full p-1 text-red-400">
                                        {error.password}
                                    </p>
                                )}
                            </div>
                            {/* <div className="block mt-1 text-left text-sm font-medium text-gray-500">
                                <span
                                    className="cursor-pointer hover:underline"
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Forgot your password ?
                                </span>
                            </div> */}

                            {loading ? (
                                <PrimaryButton
                                    type="button"
                                    disabled
                                    className="block w-full text-center mx-auto mt-4 animate-pulse"
                                >
                                    Authenticating..
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton
                                    type="submit"
                                    className="block w-full text-center mx-auto mt-4"
                                >
                                    Login
                                </PrimaryButton>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
