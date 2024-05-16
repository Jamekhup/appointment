import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";

const GuestLayout = () => {
    const { user } = useAuthContext();

    if (user) {
        return <Navigate to="/app/dashboard" />;
    }

    if (user === null) {
        return (
            <div className="flex justify-center items-center font-inter">
                <div className="w-full">
                    <Outlet />
                </div>
            </div>
        );
    }
};

export default GuestLayout;
