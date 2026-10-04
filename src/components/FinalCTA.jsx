import { Link } from "react-router-dom";
import "./FinalCTA.css";

function FinalCTA() {
    return (
        <section className="final-cta">
            <div className="final-cta-container">

                <p className="final-cta-label">
                    READY FOR YOUR NEXT EVENT?
                </p>

                <h2>
                    Your Event Experience
                    <span> Starts Here.</span>
                </h2>

                <p className="final-cta-description">
                    Register for your event, choose your preferred ticket,
                    complete your payment, and keep everything organized
                    from your EventPro dashboard.
                </p>

                <div className="final-cta-buttons">

                    <Link
                        to="/register"
                        className="final-cta-primary"
                    >
                        Register Now
                    </Link>

                    <Link
                        to="/login"
                        className="final-cta-secondary"
                    >
                        Login to Dashboard
                    </Link>

                </div>

            </div>
        </section>
    );
}

export default FinalCTA;