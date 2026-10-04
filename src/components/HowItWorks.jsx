import "./HowItWorks.css";

function HowItWorks() {
    return (
        <section className="how-it-works">

            <div className="how-container">

                <div className="how-heading">

                    <p className="how-label">
                        HOW EVENTPRO WORKS
                    </p>

                    <h2>
                        From Registration
                        <span> To Your Ticket</span>
                    </h2>

                    <p>
                        We've designed EventPro to make the entire event
                        registration process simple. From creating your
                        registration to receiving your ticket, everything
                        happens in a few straightforward steps.
                    </p>

                </div>


                <div className="steps-grid">

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <h3>
                            Create Your Registration
                        </h3>

                        <p>
                            Provide your name, email address, phone number,
                            and select the ticket option you want.
                        </p>

                    </div>


                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <h3>
                            Make Your Payment
                        </h3>

                        <p>
                            Continue to Paystack and complete your event
                            payment using an available payment method.
                        </p>

                    </div>


                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <h3>
                            Payment Verification
                        </h3>

                        <p>
                            EventPro verifies your payment and updates your
                            registration when the transaction is successful.
                        </p>

                    </div>


                    <div className="step">

                        <div className="step-number">
                            04
                        </div>

                        <h3>
                            Access Your Ticket
                        </h3>

                        <p>
                            Once your payment has been confirmed, your
                            digital ticket becomes available from your
                            dashboard.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default HowItWorks;