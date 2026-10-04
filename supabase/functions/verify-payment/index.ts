import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {

    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {

        if (req.method !== "POST") {
            return new Response(
                JSON.stringify({
                    error: "Method not allowed",
                }),
                {
                    status: 405,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const supabase = createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization:
                            req.headers.get("Authorization") ?? "",
                    },
                },
            }
        );

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return new Response(
                JSON.stringify({
                    error: "You must be logged in.",
                }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const { reference } = await req.json();

        if (!reference) {
            return new Response(
                JSON.stringify({
                    error: "Payment reference is required.",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!PAYSTACK_SECRET_KEY) {
            return new Response(
                JSON.stringify({
                    error: "Payment service is not configured.",
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const paystackResponse = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const paystackData = await paystackResponse.json();

        if (!paystackResponse.ok || !paystackData.status) {
            return new Response(
                JSON.stringify({
                    error:
                        paystackData.message ||
                        "Unable to verify payment.",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const transaction = paystackData.data;

        if (transaction.status !== "success") {
            return new Response(
                JSON.stringify({
                    error: "Payment was not successful.",
                    payment_status: transaction.status,
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (transaction.metadata?.user_id !== user.id) {
            return new Response(
                JSON.stringify({
                    error: "Payment does not belong to this user.",
                }),
                {
                    status: 403,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const { data: registration, error: registrationError } =
            await supabase
                .from("eventpro_registrations")
                .select("*")
                .eq("user_id", user.id)
                .maybeSingle();

        if (registrationError) {
            console.error(
                "Registration lookup error:",
                registrationError
            );

            return new Response(
                JSON.stringify({
                    error: "Unable to find registration.",
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!registration) {
            return new Response(
                JSON.stringify({
                    error: "Registration not found.",
                }),
                {
                    status: 404,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const expectedAmount =
            Number(registration.amount) * 100;

        if (transaction.amount !== expectedAmount) {
            return new Response(
                JSON.stringify({
                    error: "Payment amount does not match registration amount.",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const { error: updateError } = await supabase
            .from("eventpro_registrations")
            .update({
                payment_status: "paid",
                payment_reference: reference,
                paid_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

        if (updateError) {
            console.error(
                "Registration update error:",
                updateError
            );

            return new Response(
                JSON.stringify({
                    error: "Payment was verified but registration could not be updated.",
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Payment verified successfully.",
                payment_status: "paid",
                reference: reference,
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );

        return new Response(
            JSON.stringify({
                error: "Something went wrong while verifying payment.",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
});