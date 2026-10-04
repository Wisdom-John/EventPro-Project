import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        const { error: loginError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (loginError) {
            console.error("Login error:", loginError);

            setError(
                loginError.message ||
                "Unable to login. Please check your details."
            );

            setLoading(false);
            return;
        }

        navigate("/dashboard");
    };

    return (
        <main className="login-page">

            <div className="login-container">

                {/* Login Introduction */}

                <div className="login-intro">

                    <p className="login-label">
                        WELCOME BACK TO EVENTPRO
                    </p>

                    <h1>
                        Your Event
                        <span> Awaits.</span>
                    </h1>

                    <p>
                        Login to your EventPro account to manage your
                        registration, check your payment status, and access
                        your digital event ticket.
                    </p>

                    <div className="login-highlights">

                        <div className="login-highlight">
                            <strong>01</strong>
                            <span>
                                Manage your registration
                            </span>
                        </div>

                        <div className="login-highlight">
                            <strong>02</strong>
                            <span>
                                Track your payment
                            </span>
                        </div>

                        <div className="login-highlight">
                            <strong>03</strong>
                            <span>
                                Access your ticket
                            </span>
                        </div>

                    </div>

                </div>

                {/* Login Card */}

                <div className="login-card">

                    <div className="login-card-heading">

                        <h2>Welcome Back</h2>

                        <p>
                            Login to continue to your dashboard.
                        </p>

                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="login-form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="you@example.com"
                                required
                            />

                        </div>

                        <div className="login-form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging In..."
                                : "Login to Dashboard"}
                        </button>

                    </form>

                    <div className="login-divider">
                        <span>OR</span>
                    </div>

                    <p className="register-prompt">
                        Don't have an account?{" "}
                        <Link to="/register">
                            Create an account
                        </Link>
                    </p>

                </div>

            </div>

        </main>
    );
}

export default Login;