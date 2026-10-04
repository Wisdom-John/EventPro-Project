import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function ProtectedRoute({ children }) {
    const [ session, setSession ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
    checkSession();

    }, []);

    const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Session error:", error);
        }
        setSession(data.session);
        setLoading(false);
    };

    if (loading) {
        return <p> Checking Authentiction... </p>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;

}

export default ProtectedRoute;