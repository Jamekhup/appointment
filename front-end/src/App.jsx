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

import Patient from "./pages/Auth/Patient/Patient";
import PatientDetail from "./pages/Auth/Patient/PatientDetail";
import CreatePatient from "./pages/Auth/Patient/CreatePatient";
import EditPatient from "./pages/Auth/Patient/EditPatient";

import Service from "./pages/Auth/Service/Service";


import Setting from "./pages/Auth/Setting";

import NotFound from "./pages/Auth/NotFound";
import Payments from "./pages/Auth/PaymentRecord/Payments";
import PaymentDetail from "./pages/Auth/PaymentRecord/PaymentDetail";
import AppointmentDetail from "./pages/Auth/Appointment/AppointmentDetail";
import EditPayment from "./pages/Auth/PaymentRecord/EditPayment";
import PaymentExportPdf from "./pages/Auth/PaymentRecord/PaymentExportPdf";
import ProtectedRoute from "./components/ProtectedRoute";
import Therapist from "./pages/Auth/Therapist/Therapist";

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

                <Route element={<ProtectedRoute />}>
                    <Route path="list" element={<AppointmentList />} />
                    <Route
                        path="list/detail/:id"
                        element={<AppointmentDetail />}
                    />

                    <Route path="patient" element={<Patient />} />
                    <Route
                        path="patient/detail/:id"
                        element={<PatientDetail />}
                        errorElement={<NotFound />}
                    />
                    <Route path="patient/create" element={<CreatePatient />} />
                    <Route path="patient/edit/:id" element={<EditPatient />} />

                    <Route path="payments" element={<Payments />} />
                    <Route
                        path="payments/detail/:id"
                        element={<PaymentDetail />}
                    />
                    <Route path="payments/edit/:id" element={<EditPayment />} />
                    <Route
                        path="payments/export/:id"
                        element={<PaymentExportPdf />}
                    />

                    <Route path="service" element={<Service />} />

                </Route>

                <Route path="therapist" element={<Therapist/>} />

                <Route path="setting" element={<Setting />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
