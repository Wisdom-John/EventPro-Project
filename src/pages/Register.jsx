import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        ticket_type: "Regular Ticket",
        amount: 100,
        password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const tickets = [
        {
            name: "Regular Ticket",
            amount: 100,
            description: "Standard access to the event.",
        },
        {
            name: "VIP Ticket",
            amount: 200,
            description: "Enhanced access for VIP attendees.",
        },
        {
            name: "Gold Ticket",
            amount: 300,
            description: "Premium event experience.",
        },
        {
            name: "Table For Five",
            amount: 500,
            description: "Group access for five people.",
        },
        {
            name: "Table For Ten",
            amount: 800,
            description: "Group access for ten people.",
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleTicketSelect = (ticket) => {
        setFormData((previous) => ({
            ...previous,
            ticket_type: ticket.name,
            amount: ticket.amount,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.phone_number ||
            !formData.password ||
            !formData.confirm_password
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const {
                data: authData,
                error: authError,
            } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) {
                throw authError;
            }

            if (!authData.user) {
                throw new Error(
                    "Registration could not be completed."
                );
            }

            const { error: registrationError } =
                await supabase
                    .from("eventpro_registrations")
                    .insert([
                        {
                            user_id: authData.user.id,
                            name: formData.name,
                            email: formData.email,
                            phone_number: formData.phone_number,
                            ticket_type: formData.ticket_type,
                            amount: formData.amount,
                            payment_status: "pending",
                        },
                    ]);

            if (registrationError) {
                throw registrationError;
            }

            setSuccess(
                "Registration successful! Redirecting you to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (registrationError) {
            console.error(
                "Registration error:",
                registrationError
            );

            setError(
                registrationError.message ||
                "Something went wrong during registration."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page">

            <div className="register-container">

                {/* Introduction */}

                <div className="register-intro">

                    <p className="register-label">
                        EVENTPRO REGISTRATION
                    </p>

                    <h1>
                        Secure Your
                        <span> Event Ticket.</span>
                    </h1>

                    <p>
                        Create your EventPro account, choose your preferred
                        ticket, and get ready for an unforgettable event
                        experience.
                    </p>

                    <div className="register-info">

                        <div>
                            <strong>01</strong>
                            <span>Create your account</span>
                        </div>

                        <div>
                            <strong>02</strong>
                            <span>Choose your ticket</span>
                        </div>

                        <div>
                            <strong>03</strong>
                            <span>Complete your payment</span>
                        </div>

                    </div>

                </div>

                {/* Registration Form */}

                <div className="register-card">

                    <div className="register-card-heading">

                        <h2>Create Account</h2>

                        <p>
                            Enter your details to get started.
                        </p>

                    </div>

                    {error && (
                        <div className="register-message error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="register-message success-message">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="phone_number">
                                    Phone Number
                                </label>

                                <input
                                    id="phone_number"
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="08012345678"
                                    required
                                />

                            </div>

                        </div>

                        <div className="ticket-selection">

                            <div className="ticket-selection-heading">

                                <label>
                                    Select Your Ticket
                                </label>

                                <span>
                                    Choose one option
                                </span>

                            </div>

                            <div className="register-ticket-grid">

                                {tickets.map((ticket) => (

                                    <button
                                        type="button"
                                        key={ticket.name}
                                        className={`register-ticket ${
                                            formData.ticket_type === ticket.name
                                                ? "selected-ticket"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleTicketSelect(ticket)
                                        }
                                    >

                                        <div>
                                            <h3>{ticket.name}</h3>

                                            <p>
                                                {ticket.description}
                                            </p>
                                        </div>

                                        <strong>
                                            ₦{ticket.amount.toLocaleString()}
                                        </strong>

                                    </button>

                                ))}

                            </div>

                        </div>

                        <div className="selected-ticket-summary">

                            <span>
                                Selected Ticket
                            </span>

                            <strong>
                                {formData.ticket_type}
                            </strong>

                            <strong>
                                ₦{Number(formData.amount).toLocaleString()}
                            </strong>

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label htmlFor="confirm_password">
                                    Confirm Password
                                </label>

                                <input
                                    id="confirm_password"
                                    type="password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    <p className="login-prompt">
                        Already have an account?{" "}
                        <Link to="/login">
                            Login here
                        </Link>
                    </p>

                </div>

            </div>

        </main>
    );
}

export default Register;