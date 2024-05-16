import { Outlet, useLocation } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import NotFound from "../pages/Auth/NotFound";

const ProtectedRoute = () => {
    const location = useLocation();
    const { user } = useAuthContext();

    if (location.pathname.includes("/app/list")) {
        if (user?.appointmentListAccess == 1) return <Outlet />;
    }
    if (location.pathname.includes("/app/patient")) {
        if (user?.patientAccess == 1) return <Outlet />;
    }
    if (location.pathname.includes("/app/payments")) {
        if (user?.paymentAccess == 1) return <Outlet />;
    }
    if (location.pathname.includes("/app/service")) {
        if (user?.serviceAccess == 1) return <Outlet />;
    }
    if (location.pathname.includes("/app/employee")) {
        if (user?.employeeAccess == 1) return <Outlet />;
    }

    return <NotFound />;
};
export default ProtectedRoute;
