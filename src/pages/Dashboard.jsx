import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Dashboard.css";

function Dashboard() {
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getRegistration();
    }, []);

    const getRegistration = async () => {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
            console.error("User error:", userError);
            setError(userError.message);
            setLoading(false);
            return;
        }

        if (!user) {
            setError("No logged-in user found.");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("eventpro_registrations")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        if (error) {
            console.error("Registration error:", error);
            setError(error.message);
            setLoading(false);
            return;
        }

        setRegistration(data);
        setLoading(false);
    };

    const handlePayment = async () => {
        if (!registration) return;

        setPaying(true);
        setError(null);

        const { data, error } =
            await supabase.functions.invoke(
                "initialize-payment",
                {
                    body: {
                        amount: registration.amount,
                    },
                }
            );

        if (error) {
            console.error(
                "Payment initialization error:",
                error
            );

            setError(error.message);
            setPaying(false);
            return;
        }

        if (!data?.authorization_url) {
            setError("Unable to start payment.");
            setPaying(false);
            return;
        }

        window.location.href = data.authorization_url;
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-loading">
                    <p>Loading your dashboard...</p>
                </div>
            </main>
        );
    }

    if (error && !registration) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-error">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>

                    <Link to="/register">
                        Register for an Event
                    </Link>
                </div>
            </main>
        );
    }

    if (!registration) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-empty">

                    <p className="dashboard-label">
                        EVENTPRO DASHBOARD
                    </p>

                    <h1>
                        Welcome to
                        <span> EventPro.</span>
                    </h1>

                    <p>
                        You have not registered for an event yet.
                        Register now to secure your place.
                    </p>

                    <Link
                        to="/register"
                        className="dashboard-primary-btn"
                    >
                        Register for an Event
                    </Link>

                </div>
            </main>
        );
    }

    const isPaid =
        registration.payment_status === "paid";

    return (
        <main className="dashboard-page">

            <div className="dashboard-container">

                {/* Header */}

                <div className="dashboard-header">

                    <div>
                        <p className="dashboard-label">
                            EVENTPRO DASHBOARD
                        </p>

                        <h1>
                            Welcome back,
                            <span> {registration.name}.</span>
                        </h1>

                        <p>
                            Manage your registration, payment,
                            and event ticket from one place.
                        </p>
                    </div>

                    <div
                        className={`payment-badge ${
                            isPaid
                                ? "paid-badge"
                                : "pending-badge"
                        }`}
                    >
                        <span></span>

                        {isPaid
                            ? "Payment Completed"
                            : "Payment Pending"}
                    </div>

                </div>

                {/* Error */}

                {error && (
                    <div className="dashboard-inline-error">
                        {error}
                    </div>
                )}

                {/* Main Grid */}

                <div className="dashboard-grid">

                    {/* Registration Card */}

                    <section className="dashboard-card registration-card">

                        <div className="card-heading">
                            <div>
                                <p className="card-label">
                                    REGISTRATION
                                </p>

                                <h2>
                                    Your Event Details
                                </h2>
                            </div>

                            <div className="card-number">
                                01
                            </div>
                        </div>

                        <div className="details-list">

                            <div className="detail-item">
                                <span>Full Name</span>
                                <strong>
                                    {registration.name}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Email Address</span>
                                <strong>
                                    {registration.email}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Phone Number</span>
                                <strong>
                                    {registration.phone_number}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Ticket Type</span>
                                <strong>
                                    {registration.ticket_type}
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* Payment Card */}

                    <section className="dashboard-card payment-card">

                        <div className="card-heading">
                            <div>
                                <p className="card-label">
                                    PAYMENT
                                </p>

                                <h2>
                                    Payment Details
                                </h2>
                            </div>

                            <div className="card-number">
                                02
                            </div>
                        </div>

                        <div className="payment-amount">
                            <span>Total Amount</span>

                            <strong>
                                ₦
                                {Number(
                                    registration.amount
                                ).toLocaleString()}
                            </strong>
                        </div>

                        <div className="payment-status-row">

                            <span>
                                Payment Status
                            </span>

                            <strong
                                className={
                                    isPaid
                                        ? "status-paid"
                                        : "status-pending"
                                }
                            >
                                {registration.payment_status}
                            </strong>

                        </div>

                        {!isPaid && (
                            <button
                                className="pay-button"
                                onClick={handlePayment}
                                disabled={paying}
                            >
                                {paying
                                    ? "Processing Payment..."
                                    : "Pay Now"}
                            </button>
                        )}

                        {isPaid && (
                            <div className="payment-complete">
                                <strong>
                                    Payment Successful
                                </strong>

                                <p>
                                    Your payment has been
                                    verified successfully.
                                </p>
                            </div>
                        )}

                    </section>

                    {/* Ticket Card */}

                    <section className="dashboard-card ticket-status-card">

                        <div className="card-heading">
                            <div>
                                <p className="card-label">
                                    YOUR TICKET
                                </p>

                                <h2>
                                    Ticket Access
                                </h2>
                            </div>

                            <div className="card-number">
                                03
                            </div>
                        </div>

                        {isPaid ? (
                            <>
                                <div className="ticket-ready">
                                    <div className="ticket-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <strong>
                                            Your ticket is ready
                                        </strong>

                                        <p>
                                            Your payment has been
                                            confirmed. You can now
                                            access your EventPro ticket.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to="/ticket"
                                    className="ticket-access-btn"
                                >
                                    View My Ticket
                                </Link>
                            </>
                        ) : (
                            <div className="ticket-locked">

                                <div className="ticket-icon locked">
                                    🔒
                                </div>

                                <div>
                                    <strong>
                                        Ticket locked
                                    </strong>

                                    <p>
                                        Complete your payment to
                                        unlock your digital ticket.
                                    </p>
                                </div>

                            </div>
                        )}

                    </section>

                    {/* Event Information */}

                    <section className="dashboard-card event-info-card">

                        <div className="card-heading">
                            <div>
                                <p className="card-label">
                                    EVENTPRO
                                </p>

                                <h2>
                                    Your Event Journey
                                </h2>
                            </div>
                        </div>

                        <div className="journey-list">

                            <div
                                className={`journey-item ${
                                    registration
                                        ? "completed"
                                        : ""
                                }`}
                            >
                                <span>01</span>

                                <div>
                                    <strong>
                                        Registration
                                    </strong>

                                    <p>
                                        Your event registration
                                        has been created.
                                    </p>
                                </div>
                            </div>

                            <div
                                className={`journey-item ${
                                    isPaid
                                        ? "completed"
                                        : "current"
                                }`}
                            >
                                <span>02</span>

                                <div>
                                    <strong>
                                        Payment
                                    </strong>

                                    <p>
                                        {isPaid
                                            ? "Your payment has been confirmed."
                                            : "Complete your payment to continue."}
                                    </p>
                                </div>
                            </div>

                            <div
                                className={`journey-item ${
                                    isPaid
                                        ? "completed"
                                        : ""
                                }`}
                            >
                                <span>03</span>

                                <div>
                                    <strong>
                                        Ticket
                                    </strong>

                                    <p>
                                        {isPaid
                                            ? "Your digital ticket is available."
                                            : "Your ticket will be available after payment."}
                                    </p>
                                </div>
                            </div>

                        </div>

                    </section>

                </div>

            </div>

        </main>
    );
}

export default Dashboard;