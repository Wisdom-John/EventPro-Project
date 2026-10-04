import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function AdminRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        let mounted = true;

        const checkAdmin = async () => {

            try {

                // Get the current Supabase session
                const {
                    data: { session },
                    error: sessionError
                } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error(
                        "Session error:",
                        sessionError
                    );

                    if (mounted) {
                        setIsAdmin(false);
                        setLoading(false);
                    }

                    return;
                }

                // No active login session
                if (!session) {

                    console.log(
                        "No active login session."
                    );

                    if (mounted) {
                        setIsAdmin(false);
                        setLoading(false);
                    }

                    return;
                }

                const user = session.user;

                console.log("Admin session found.");
                console.log("Admin UUID:", user.id);

                // Check whether the user exists in admin_users
                const {
                    data,
                    error
                } = await supabase
                    .from("admin_users")
                    .select("user_id")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (error) {

                    console.error(
                        "Admin database check error:",
                        error
                    );

                    if (mounted) {
                        setIsAdmin(false);
                        setLoading(false);
                    }

                    return;
                }

                if (data) {

                    console.log("Admin verified.");

                    if (mounted) {
                        setIsAdmin(true);
                    }

                } else {

                    console.log(
                        "User is not an admin."
                    );

                    if (mounted) {
                        setIsAdmin(false);
                    }
                }

            } catch (error) {

                console.error(
                    "Admin verification error:",
                    error
                );

                if (mounted) {
                    setIsAdmin(false);
                }

            } finally {

                if (mounted) {
                    setLoading(false);
                }
            }
        };

        checkAdmin();

        return () => {
            mounted = false;
        };

    }, []);

    // Wait until admin verification is complete
    if (loading) {
        return (
            <div className="admin-route-loading">
                <p>Checking admin access...</p>
            </div>
        );
    }

    // Redirect non-admin users
    if (!isAdmin) {
        return (
            <Navigate
                to="/login"
                state={{ from: "/admin" }}
                replace
            />
        );
    }

    // Allow verified admin
    return children;
}

export default AdminRoute;