import { Link } from "react-router-dom";
import "./EventExperience.css";

function EventExperience() {

    const events = [
        {
            title: "Conferences",
            description:
                "Connect with people, learn from inspiring speakers, and participate in meaningful conversations.",
            image: "/images/1 conference.jpg",
        },

        {
            title: "Corporate Events",
            description:
                "Experience professional gatherings designed for networking, collaboration, learning, and growth.",
            image: "/images/1 corporate-event.jpg",
        },

        {
            title: "Special Events",
            description:
                "Create memorable experiences through celebrations, gatherings, entertainment, and special occasions.",
            image: "/images/1 special-event.jpg",
        },
    ];

    return (
        <section className="event-experience">

            <div className="experience-container">

                <div className="experience-heading">

                    <div>
                        <p className="experience-label">
                            THE EVENT EXPERIENCE
                        </p>

                        <h2>
                            There's Always
                            <span> Something Happening</span>
                        </h2>
                    </div>

                    <p>
                        From professional conferences to memorable
                        celebrations, EventPro gives you a simple way to
                        discover events, register, and secure your place.
                    </p>

                </div>


                <div className="experience-grid">

                    {events.map((event) => (

                        <div
                            className="experience-card"
                            key={event.title}
                        >

                            <div className="experience-image">

                                <img
                                    src={event.image}
                                    alt={event.title}
                                />

                            </div>


                            <div className="experience-content">

                                <h3>
                                    {event.title}
                                </h3>

                                <p>
                                    {event.description}
                                </p>

                                <Link to="/register">
                                    Register Now →
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}

export default EventExperience;