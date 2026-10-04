import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Brand */}
                <div className="footer-brand">
                    <Link to="/" className="footer-logo">
                        EVENT<span>PRO</span>
                    </Link>

                    <p>
                        A modern event registration and ticketing platform
                        designed to make event participation simple,
                        convenient, and secure.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-column">
                    <h3>Quick Links</h3>

                    <Link to="/">Home</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </div>

                {/* EventPro */}
                <div className="footer-column">
                    <h3>EventPro</h3>

                    <a href="#features">Features</a>
                    <a href="#tickets">Tickets</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#experience">Event Experience</a>
                </div>

                {/* Contact */}
                <div className="footer-column">
                    <h3>Get Started</h3>

                    <p>Ready to attend an event?</p>

                    <Link
                        to="/register"
                        className="footer-register-btn"
                    >
                        Register Now
                    </Link>
                </div>

            </div>

            <div className="footer-bottom">
                <p>
                    © {currentYear} EventPro. All rights reserved.
                </p>

                <p>
                    Built with React & Supabase
                </p>
            </div>
        </footer>
    );
}

export default Footer;