import { Link } from "react-router-dom";
import "./EventFeatures.css";

function EventFeatures() {
    return (
        <section className="features">

            <div className="features-container">

                <div className="features-heading">

                    <p className="features-label">
                        WHY EVENTPRO
                    </p>

                    <h2>
                        Everything You Need
                        <span> For Your Event</span>
                    </h2>

                    <p>
                        EventPro brings registration, ticketing, payments,
                        and event information together in one simple
                        platform.
                    </p>

                </div>


                <div className="features-grid">

                    <div className="feature-card">

                        <div className="feature-number">
                            01
                        </div>

                        <h3>
                            Easy Registration
                        </h3>

                        <p>
                            Register for your event quickly by providing
                            your basic information and selecting the ticket
                            option that works best for you.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-number">
                            02
                        </div>

                        <h3>
                            Secure Payments
                        </h3>

                        <p>
                            Complete your event payment through Paystack
                            and receive confirmation once your transaction
                            has been successfully verified.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-number">
                            03
                        </div>

                        <h3>
                            Digital Tickets
                        </h3>

                        <p>
                            Once your payment is confirmed, your ticket
                            becomes available directly from your EventPro
                            dashboard.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-number">
                            04
                        </div>

                        <h3>
                            Personal Dashboard
                        </h3>

                        <p>
                            Keep track of your registration details, ticket
                            type, payment status, payment reference, and
                            ticket information from one place.
                        </p>

                    </div>

                </div>


                <div className="features-action">

                    <p>
                        Ready to secure your place at an event?
                    </p>

                    <Link to="/register">
                        Register for an Event
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default EventFeatures;