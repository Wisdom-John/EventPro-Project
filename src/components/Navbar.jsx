import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./Navbar.css";

function Navbar() {

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        getUser();

        const { data: listener } =
            supabase.auth.onAuthStateChange(
                (_event, session) => {
                    setUser(session?.user ?? null);
                }
            );

        return () => {
            listener.subscription.unsubscribe();
        };

    }, []);


    const getUser = async () => {

        const {
            data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

    };


    const handleLogout = async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            return;
        }

        navigate("/");

    };


return (
    <nav className="navbar">

        <div className="navbar-container">

            <Link
                to="/"
                className="navbar-logo"
            >
                EVENT<span>PRO</span>
            </Link>


            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>


                {!user && (
                    <>
                        <Link
                            to="/register"
                            className="register-btn"
                        >
                            Register
                        </Link>

                        <Link to="/login">
                            Login
                        </Link>
                    </>
                )}


                {user && (
                    <>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </div>

    </nav>
);
}

export default Navbar;