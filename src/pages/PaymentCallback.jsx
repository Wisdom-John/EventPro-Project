import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./PaymentCallback.css";

function PaymentCallback() {

    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState(
        "Please wait while we verify your payment..."
    );

    useEffect(() => {

        const verifyPayment = async () => {

            const reference = searchParams.get("reference");

            if (!reference) {
                setStatus("error");
                setMessage("Payment reference was not found.");
                return;
            }

            const { data, error } =
                await supabase.functions.invoke(
                    "verify-payment",
                    {
                        body: {
                            reference,
                        },
                    }
                );

            if (error) {

                console.error(
                    "Payment verification error:",
                    error
                );

                setStatus("error");

                setMessage(
                    error.message ||
                    "Unable to verify payment."
                );

                return;
            }

            if (!data?.success) {

                setStatus("error");

                setMessage(
                    data?.message ||
                    "Payment verification failed."
                );

                return;
            }

            setStatus("success");

            setMessage(
                "Your payment has been verified successfully."
            );
        };

        verifyPayment();

    }, [searchParams]);

    return (
        <main className="payment-callback-page">

            <div className="payment-callback-card">

                {/* VERIFYING */}
                {status === "verifying" && (
                    <div className="payment-state">

                        <div className="payment-spinner"></div>

                        <p className="payment-label">
                            EVENTPRO PAYMENT
                        </p>

                        <h1>
                            Verifying
                            <span> Payment...</span>
                        </h1>

                        <p className="payment-message">
                            {message}
                        </p>

                        <div className="payment-security">
                            <span>🔒</span>
                            Secure payment verification
                        </div>

                    </div>
                )}

                {/* SUCCESS */}
                {status === "success" && (
                    <div className="payment-state">

                        <div className="payment-success-icon">
                            ✓
                        </div>

                        <p className="payment-label">
                            EVENTPRO PAYMENT
                        </p>

                        <h1>
                            Payment
                            <span> Successful!</span>
                        </h1>

                        <p className="payment-message">
                            {message}
                        </p>

                        <div className="payment-confirmation">
                            <span>✓</span>
                            Payment confirmed
                        </div>

                        <Link
                            to="/dashboard"
                            className="payment-primary-btn"
                        >
                            Go to Dashboard
                        </Link>

                        <Link
                            to="/ticket"
                            className="payment-secondary-btn"
                        >
                            View My Ticket
                        </Link>

                    </div>
                )}

                {/* ERROR */}
                {status === "error" && (
                    <div className="payment-state">

                        <div className="payment-error-icon">
                            !
                        </div>

                        <p className="payment-label">
                            EVENTPRO PAYMENT
                        </p>

                        <h1>
                            Payment
                            <span> Failed.</span>
                        </h1>

                        <p className="payment-message">
                            {message}
                        </p>

                        <div className="payment-error-box">
                            Your payment could not be verified.
                            Please return to your dashboard and
                            try again.
                        </div>

                        <Link
                            to="/dashboard"
                            className="payment-primary-btn"
                        >
                            Return to Dashboard
                        </Link>

                    </div>
                )}

            </div>

        </main>
    );
}

export default PaymentCallback;
