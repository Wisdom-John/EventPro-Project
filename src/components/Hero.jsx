import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
    return (
        <section className="hero">

            <div className="hero-content">

                <div className="hero-text">

                    <p className="hero-label">
                        EVENT MANAGEMENT MADE SIMPLE
                    </p>

                    <h1>
                        Create. Connect.
                        <span> Celebrate.</span>
                    </h1>

                    <p className="hero-description">
                        EventPro is a modern event registration and ticketing
                        platform designed to make attending and managing events
                        simple, convenient, and secure. Whether you are joining
                        a conference, attending a special celebration, taking
                        part in a corporate event, or simply looking for your
                        next memorable experience, EventPro gives you a simple
                        way to register and manage your event participation.
                    </p>

                    <p className="hero-description">
                        From choosing your preferred ticket to completing your
                        payment and accessing your digital ticket, everything
                        is organized in one place. Your dashboard allows you to
                        keep track of your registration and payment status,
                        while your digital ticket gives you easy access to your
                        event information whenever you need it.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="hero-btn primary-btn"
                        >
                            Register Now
                        </Link>

                        <Link
                            to="/dashboard"
                            className="hero-btn secondary-btn"
                        >
                            View Dashboard
                        </Link>

                    </div>

                </div>


                <div className="hero-image">

                    <img
                        src="/images/event-hero.jpg"
                        alt="People attending an event"
                    />

                </div>

            </div>

        </section>
    );
}

export default Hero;