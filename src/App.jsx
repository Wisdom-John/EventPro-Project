import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PaymentCallback from "./pages/PaymentCallback";
import Dashboard from "./pages/Dashboard";
import Ticket from "./pages/Ticket";
import AdminDashboard from "./pages/AdminDashboard"


function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route
                        path="/ticket" element={
                    <ProtectedRoute>
                        <Ticket />
                    </ProtectedRoute>
                    } />
                    
                <Route path="/admin"element = {
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />

            </Routes>
            
        <Footer />

        </BrowserRouter>
    );
}

export default App;