import { Route, Routes } from "react-router-dom";

// layouts
import GuestLayout from "./layouts/GuestLayout";
import AuthLayout from "./layouts/AuthLayout";

//guest pages
import Login from "./pages/Guest/Login";
import ForgotPassword from "./pages/Guest/ForgotPassword";
import ResetPassword from "./pages/Guest/ResetPassword";

//auth pages
import Dashboard from "./pages/Auth/Dashboard";
import Appointment from "./pages/Auth/Appointment/Appointment";
import AppointmentList from "./pages/Auth/Appointment/AppointmentList";

import Customer from "./pages/Auth/Customer/Customer";
import CreateCustomer from "./pages/Auth/Customer/CreateCustomer";
import EditCustomer from "./pages/Auth/Customer/EditCustomer";

import Service from "./pages/Auth/Service/Service";
import CreateService from "./pages/Auth/Service/CreateService";
import EditService from "./pages/Auth/Service/EditService";

import Employee from "./pages/Auth/Employee/Employee";
import CreateEmployee from "./pages/Auth/Employee/CreateEmployee";
import EditEmployee from "./pages/Auth/Employee/EditEmployee";

import Setting from "./pages/Auth/Setting";

import NotFound from "./pages/Auth/NotFound";

function App() {
    return (
        <Routes>
            {/* for guest layout */}
            <Route path="/" element={<GuestLayout />}>
                <Route index element={<Login />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:id" element={<ResetPassword />} />
            </Route>

            {/* for auth layout */}
            <Route path="/app" element={<AuthLayout />}>
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="appointment" element={<Appointment />} />
                <Route path="list" element={<AppointmentList />} />

                <Route path="customer" element={<Customer />} />
                <Route path="customer/create" element={<CreateCustomer />} />
                <Route path="customer/edit/:id" element={<EditCustomer />} />

                <Route path="service" element={<Service />} />
                <Route path="service/create" element={<CreateService />} />
                <Route path="service/edit/:id" element={<EditService />} />

                <Route path="employee" element={<Employee />} />
                <Route path="employee/create" element={<CreateEmployee />} />
                <Route path="employee/edit/:id" element={<EditEmployee />} />

                <Route path="setting" element={<Setting />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
