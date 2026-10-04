import { Link } from "react-router-dom";
import "./TicketPlans.css";

function TicketPlans() {

    const tickets = [
        {
            name: "Regular Ticket",
            price: 100,
            description: "Standard access to the event.",
        },
        {
            name: "VIP Ticket",
            price: 200,
            description: "Enhanced access for VIP attendees.",
            featured: true,
        },
        {
            name: "Gold Ticket",
            price: 300,
            description: "Premium event experience.",
        },
        {
            name: "Table For Five",
            price: 500,
            description: "Group access for five people.",
        },
        {
            name: "Table For Ten",
            price: 800,
            description: "Group access for ten people.",
        },
    ];

    return (
        <section className="ticket-plans">

            <div className="ticket-plans-container">

                <div className="ticket-heading">

                    <p className="ticket-label">
                        TICKETS & PRICING
                    </p>

                    <h2>
                        Choose Your
                        <span> Ticket</span>
                    </h2>

                    <p>
                        Select the ticket option that best suits your
                        event experience. Complete your registration and
                        secure your place through our simple payment
                        process.
                    </p>

                </div>


                <div className="ticket-grid">

                    {tickets.map((ticket) => (

                        <div
                            className={`ticket-card ${
                                ticket.featured
                                    ? "featured-ticket"
                                    : ""
                            }`}
                            key={ticket.name}
                        >

                            {ticket.featured && (
                                <div className="popular-badge">
                                    POPULAR
                                </div>
                            )}

                            <h3>
                                {ticket.name}
                            </h3>

                            <div className="ticket-price">
                                ₦{ticket.price.toLocaleString()}
                            </div>

                            <p>
                                {ticket.description}
                            </p>

                            <Link
                                to="/register"
                                className="ticket-button"
                            >
                                Register Now
                            </Link>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}

export default TicketPlans;