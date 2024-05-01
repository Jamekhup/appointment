import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const GuestLayout = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default GuestLayout;
