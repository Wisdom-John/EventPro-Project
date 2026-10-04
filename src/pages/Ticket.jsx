import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Ticket.css";

function Ticket() {
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getTicket();
    }, []);

    const getTicket = async () => {
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
            .single();

        if (error) {
            console.error("Ticket error:", error);
            setError(error.message);
            setLoading(false);
            return;
        }

        if (data.payment_status !== "paid") {
            setError(
                "Your ticket is not available yet. Please complete your payment first."
            );
            setLoading(false);
            return;
        }

        setRegistration(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <main className="ticket-page">
                <div className="ticket-loading">
                    <p>Loading your ticket...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="ticket-page">
                <div className="ticket-error">

                    <div className="ticket-error-icon">
                        !
                    </div>

                    <p className="ticket-label">
                        EVENTPRO TICKET
                    </p>

                    <h1>
                        Ticket
                        <span> Unavailable.</span>
                    </h1>

                    <p>{error}</p>

                    <a href="/dashboard">
                        Return to Dashboard
                    </a>

                </div>
            </main>
        );
    }

    return (
        <main className="ticket-page">

            <div className="ticket-container">

                {/* Header */}

                <div className="ticket-header">

                    <div>
                        <p className="ticket-label">
                            EVENTPRO DIGITAL TICKET
                        </p>

                        <h1>
                            Your Event
                            <span> Ticket.</span>
                        </h1>

                        <p>
                            Your payment has been confirmed. Keep this
                            ticket available for your event experience.
                        </p>
                    </div>

                    <div className="ticket-status">
                        <span></span>
                        Payment Confirmed
                    </div>

                </div>

                {/* Ticket */}

                <div className="digital-ticket">

                    <div className="ticket-main">

                        <div className="ticket-brand">
                            EVENT<span>PRO</span>
                        </div>

                        <div className="ticket-title">
                            <p>ADMISSION TICKET</p>

                            <h2>
                                {registration.ticket_type}
                            </h2>
                        </div>

                        <div className="ticket-details">

                            <div className="ticket-detail">
                                <span>ATTENDEE</span>
                                <strong>
                                    {registration.name}
                                </strong>
                            </div>

                            <div className="ticket-detail">
                                <span>EMAIL</span>
                                <strong>
                                    {registration.email}
                                </strong>
                            </div>

                            <div className="ticket-detail">
                                <span>PHONE</span>
                                <strong>
                                    {registration.phone_number}
                                </strong>
                            </div>

                            <div className="ticket-detail">
                                <span>AMOUNT PAID</span>
                                <strong>
                                    ₦
                                    {Number(
                                        registration.amount
                                    ).toLocaleString()}
                                </strong>
                            </div>

                        </div>

                    </div>

                    {/* Ticket Side */}

                    <div className="ticket-side">

                        <div className="ticket-check">
                            ✓
                        </div>

                        <p>
                            VERIFIED
                        </p>

                        <span>
                            Payment
                            <br />
                            Confirmed
                        </span>

                    </div>

                </div>

                {/* Payment Information */}

                <div className="ticket-payment-info">

                    <div>
                        <span>Payment Reference</span>

                        <strong>
                            {registration.payment_reference}
                        </strong>
                    </div>

                    <div>
                        <span>Payment Status</span>

                        <strong className="ticket-paid">
                            {registration.payment_status}
                        </strong>
                    </div>

                    <div>
                        <span>Paid At</span>

                        <strong>
                            {registration.paid_at
                                ? new Date(
                                      registration.paid_at
                                  ).toLocaleString()
                                : "N/A"}
                        </strong>
                    </div>

                </div>

                <div className="ticket-note">

                    <strong>
                        Important:
                    </strong>

                    <p>
                        Please keep your ticket information safe and
                        have it available when attending the event.
                    </p>

                </div>

            </div>

        </main>
    );
}

export default Ticket;