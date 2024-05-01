import { useState } from "react";
import axios from "../../axios";
import MetaTitle from "../../components/MetaTitle";
import PrimaryButton from "../../components/PrimaryButton";
import TextInput from "../../components/TextInput";

const forgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios
                .post(
                    "/forgot-password",
                    {
                        email,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    if (response.data.status === "success") {
                        setLoading(false);
                        setEmail("");
                        setError("");
                        setSuccess(
                            "Reset password link has been sent to your email address. Please check your email."
                        );
                    } else {
                        setError(response.data.message);
                        setLoading(false);
                    }
                });
        } catch (error) {
            if (error.response.status === 404) {
                setError(error.response.data.message);
                setLoading(false);
                setEmail("");
                setSuccess("");
            }
        }
    };

    return (
        <>
            <MetaTitle title="Forgot Password" />
            <div className="bg-gradient-to-b from-cyan-400 to-cyan-900 min-h-screen font-roboto pt-12">
                <div className="w-11/12 sm:w-[85%] md:w-[70%] lg:w-[40%] m-auto bg-white rounded-md">
                    <div className="flex flex-col rounded-md">
                        <form
                            className="w-full text-center px-8 py-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="mt-2 text-2xl font-semibold text-slate-600">
                                Forgot password ?
                            </div>

                            {error && (
                                <p className="text-sm bg-red-300 py-1 rounded-md mt-2 px-2 text-red-600">
                                    {error}
                                </p>
                            )}
                            {success && (
                                <p className="text-sm bg-green-300 py-1 rounded-md mt-2 px-2 text-slate-600">
                                    {success}
                                </p>
                            )}

                            <div className="flex flex-col mt-4">
                                <p className="text-left text-sm">
                                    Please enter your email address associated
                                    with your account and we'll send you a link
                                    to reset your password
                                </p>
                                <label className="text-left text-sm text-gray-600 mt-2">
                                    Email
                                </label>
                                <TextInput
                                    type="email"
                                    value={email}
                                    placeholder="example@gmail.com"
                                    required
                                    autoFocus
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {loading ? (
                                <PrimaryButton
                                    className="block w-full text-center mx-auto mt-4 animate-pulse"
                                    type="button"
                                    disabled
                                >
                                    Submitting..
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton
                                    className="block w-full text-center mx-auto mt-4"
                                    type="submit"
                                >
                                    Submit
                                </PrimaryButton>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default forgotPassword;
