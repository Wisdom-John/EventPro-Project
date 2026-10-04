import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./AdminDashboard.css";

function AdminDashboard() {

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getRegistrations();
    }, []);

    const getRegistrations = async () => {

        console.log("Loading registered users...");

        const { data, error } = await supabase
            .from("eventpro_registrations")
            .select("*")
            .order("created_at", { ascending: false });

        console.log("Registrations:", data);
        console.log("Registration error:", error);

        if (error) {
            console.error("Admin dashboard error:", error);
            setError(error.message);
            setLoading(false);
            return;
        }

        setRegistrations(data || []);
        setLoading(false);
    };

    if (loading) {
        return (
            <main className="admin-page">
                <div className="admin-loading">
                    <div className="admin-spinner"></div>
                    <p>Loading registrations...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="admin-page">
                <div className="admin-error">
                    <div className="admin-error-icon">!</div>

                    <p className="admin-label">EVENTPRO ADMIN</p>

                    <h1>
                        Dashboard
                        <span> Error.</span>
                    </h1>

                    <p>
                        We could not load the registered participants.
                    </p>

                    <div className="admin-error-message">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-page">

            <div className="admin-container">

                {/* Header */}
                <div className="admin-header">

                    <div>
                        <p className="admin-label">
                            EVENTPRO ADMINISTRATION
                        </p>

                        <h1>
                            Admin
                            <span> Dashboard.</span>
                        </h1>

                        <p className="admin-description">
                            Manage event registrations and monitor
                            participant payment information.
                        </p>
                    </div>

                    <div className="admin-total-card">
                        <span>Total Registrations</span>
                        <strong>{registrations.length}</strong>
                        <small>Registered participants</small>
                    </div>

                </div>

                {/* Statistics */}
                <div className="admin-stats">

                    <div className="admin-stat-card">
                        <span>Total Participants</span>
                        <strong>{registrations.length}</strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Paid Registrations</span>
                        <strong>
                            {
                                registrations.filter(
                                    (registration) =>
                                        registration.payment_status === "paid"
                                ).length
                            }
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Pending Payments</span>
                        <strong>
                            {
                                registrations.filter(
                                    (registration) =>
                                        registration.payment_status !== "paid"
                                ).length
                            }
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Payment Revenue</span>
                        <strong>
                            ₦
                            {registrations
                                .filter(
                                    (registration) =>
                                        registration.payment_status === "paid"
                                )
                                .reduce(
                                    (total, registration) =>
                                        total + Number(registration.amount || 0),
                                    0
                                )
                                .toLocaleString()}
                        </strong>
                    </div>

                </div>

                {/* Registrations */}
                <section className="admin-section">

                    <div className="admin-section-header">
                        <div>
                            <p className="admin-label">
                                PARTICIPANT RECORDS
                            </p>

                            <h2>
                                Event
                                <span> Registrations</span>
                            </h2>
                        </div>

                        <p>
                            {registrations.length} record
                            {registrations.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {registrations.length === 0 ? (

                        <div className="admin-empty">
                            <div className="admin-empty-icon">○</div>

                            <h3>No registrations yet</h3>

                            <p>
                                Registered participants will appear here.
                            </p>
                        </div>

                    ) : (

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>
                                        <th>Participant</th>
                                        <th>Contact</th>
                                        <th>Ticket</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Reference</th>
                                        <th>Registered</th>
                                        <th>Paid At</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {registrations.map((registration) => (

                                        <tr key={registration.id}>

                                            <td>
                                                <div className="participant-name">
                                                    {registration.name}
                                                </div>

                                                <div className="participant-id">
                                                    ID: {registration.id}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="contact-info">
                                                    <span>
                                                        {registration.email}
                                                    </span>

                                                    <span>
                                                        {registration.phone_number}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="ticket-badge">
                                                    {registration.ticket_type}
                                                </span>
                                            </td>

                                            <td>
                                                <strong className="amount">
                                                    ₦
                                                    {Number(
                                                        registration.amount
                                                    ).toLocaleString()}
                                                </strong>
                                            </td>

                                            <td>
                                                <span
                                                    className={`payment-badge ${
                                                        registration.payment_status ===
                                                        "paid"
                                                            ? "paid"
                                                            : "pending"
                                                    }`}
                                                >
                                                    <span></span>

                                                    {registration.payment_status}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="reference">
                                                    {registration.payment_reference ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="date">
                                                    {new Date(
                                                        registration.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="date">
                                                    {registration.paid_at
                                                        ? new Date(
                                                              registration.paid_at
                                                          ).toLocaleDateString()
                                                        : "—"}
                                                </span>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}

export default AdminDashboard;