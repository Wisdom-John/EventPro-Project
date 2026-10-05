import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

const PAYSTACK_SECRET_KEY = Deno.env.get ("PAYSTACK_SECRET_KEY");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get ("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {

        if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {
        // Only allow POST requests
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

        // Create Supabase client using the user's access token
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

        // Get the currently logged-in user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return new Response(
                JSON.stringify({
                    error: "You must be logged in to make a payment.",
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

        // Get the amount from React
        const { amount } = await req.json();

        // Validate amount
        if (!amount) {
            return new Response(
                JSON.stringify({
                    error: "Payment amount is required.",
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

        const amountInNaira = Number(amount);

        if (
            !Number.isFinite(amountInNaira) ||
            amountInNaira <= 0
        ) {
            return new Response(
                JSON.stringify({
                    error: "Invalid payment amount.",
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

        // Convert Naira to Kobo
        const amountInKobo = Math.round(amountInNaira * 100);

        // Make sure Paystack secret exists
        if (!PAYSTACK_SECRET_KEY) {
            console.error("PAYSTACK_SECRET_KEY is missing.");

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

        // Initialize payment with Paystack
        const paystackResponse = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email: user.email,
                    amount: amountInKobo,
                    callback_url: "https://eventpro-project-siwes.vercel.app/payment/callback",

                    metadata: {
                        user_id: user.id,
                    },
                }),
            }
        );

        const paystackData = await paystackResponse.json();

        // Check Paystack response
        if (
            !paystackResponse.ok ||
            !paystackData.status
        ) {
            console.error(
                "Paystack initialization error:",
                paystackData
            );

            return new Response(
                JSON.stringify({
                    error:
                        paystackData.message ||
                        "Unable to initialize payment.",
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

        // Return payment information to React
        return new Response(
            JSON.stringify({
                message:
                    "Payment initialized successfully.",

                authorization_url:
                    paystackData.data.authorization_url,

                access_code:
                    paystackData.data.access_code,

                reference:
                    paystackData.data.reference,
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
            "Payment initialization error:",
            error
        );

        return new Response(
            JSON.stringify({
                error:
                    "Something went wrong while initializing payment.",
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