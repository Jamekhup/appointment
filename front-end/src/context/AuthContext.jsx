import { createContext, useContext, useEffect, useState } from "react";
import axios from "../axios";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;
    const [user, setUser] = useState(
        Cookies.get("app_sys") !== undefined
            ? JSON.parse(Cookies.get("app_sys"))
            : null
    );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = ({ ...data }) => {
        setLoading(true);

        axios
            .post("/login", data)
            .then((response) => {
                console.log(response);
                if (response.data.status === "success") {
                    setLoading(false);
                    Cookies.set("app_sys", JSON.stringify(response.data), {
                        expires: 20,
                    });

                    const from =
                        location.state?.from?.pathname || "/app/dashboard";

                    navigate(from, { replace: true });
                } else {
                    setError(response.data.message);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 422) {
                    setError(error.response.data.message);
                    setLoading(false);
                }
            });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                error,
                loading,
                login,
                setUser,
                pathname,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export default function useAuthContext() {
    return useContext(AuthContext);
}
