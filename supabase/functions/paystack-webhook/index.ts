import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

const SUPABASE_SECRET_KEYS = JSON.parse(
    Deno.env.get("SUPABASE_SECRET_KEYS")!
);

const SUPABASE_SECRET_KEY =
    SUPABASE_SECRET_KEYS["default"];


// Verify Paystack webhook signature
async function verifySignature(
    payload: string,
    signature: string
) {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(PAYSTACK_SECRET_KEY!),
        {
            name: "HMAC",
            hash: "SHA-512",
        },
        false,
        ["verify"]
    );

    const signatureBytes = new Uint8Array(
        signature.match(/.{1,2}/g)!.map((byte) =>
            parseInt(byte, 16)
        )
    );

    return await crypto.subtle.verify(
        "HMAC",
        key,
        signatureBytes,
        encoder.encode(payload)
    );
}


Deno.serve(async (req) => {

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
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        if (!PAYSTACK_SECRET_KEY) {
            console.error(
                "PAYSTACK_SECRET_KEY is not configured."
            );

            return new Response(
                JSON.stringify({
                    error: "Payment service is not configured.",
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        // Read the raw request body
        const rawBody = await req.text();

        // Get Paystack signature
        const signature =
            req.headers.get("x-paystack-signature");


        if (!signature) {
            return new Response(
                JSON.stringify({
                    error: "Missing Paystack signature.",
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        // Verify that the request came from Paystack
        const isValid = await verifySignature(
            rawBody,
            signature
        );


        if (!isValid) {
            return new Response(
                JSON.stringify({
                    error: "Invalid Paystack signature.",
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        // Convert request body into JSON
        const event = JSON.parse(rawBody);


        console.log(
            "Paystack webhook event:",
            event.event
        );


        // We only need successful transactions
        if (event.event !== "charge.success") {
            return new Response(
                JSON.stringify({
                    received: true,
                    message: "Event received but not processed.",
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        const transaction = event.data;


        const reference = transaction.reference;
        const userId = transaction.metadata?.user_id;


        if (!reference || !userId) {
            console.error(
                "Missing transaction reference or user ID."
            );

            return new Response(
                JSON.stringify({
                    error: "Invalid transaction data.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        // Create Supabase admin client
        const supabaseAdmin = createClient(
              SUPABASE_URL,
              SUPABASE_SECRET_KEY
            );


        // Find the user's registration
        const { data: registration, error: registrationError } =
            await supabaseAdmin
                .from("eventpro_registrations")
                .select("*")
                .eq("user_id", userId)
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
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        // Convert the registration amount to kobo
        const expectedAmount =
            Number(registration.amount) * 100;


        // Make sure the Paystack amount matches
        if (transaction.amount !== expectedAmount) {
            console.error(
                "Payment amount does not match registration amount."
            );

            return new Response(
                JSON.stringify({
                    error: "Payment amount does not match registration amount.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        // Prevent unnecessary duplicate updates
        if (
            registration.payment_status === "paid" &&
            registration.payment_reference === reference
        ) {
            return new Response(
                JSON.stringify({
                    received: true,
                    message: "Payment already processed.",
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        // Mark registration as paid
        const { error: updateError } =
            await supabaseAdmin
                .from("eventpro_registrations")
                .update({
                    payment_status: "paid",
                    payment_reference: reference,
                    paid_at: new Date().toISOString(),
                })
                .eq("user_id", userId);


        if (updateError) {
            console.error(
                "Registration update error:",
                updateError
            );

            return new Response(
                JSON.stringify({
                    error: "Payment received but registration could not be updated.",
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }


        console.log(
            "Payment successfully recorded:",
            reference
        );


        return new Response(
            JSON.stringify({
                received: true,
                success: true,
                message: "Payment processed successfully.",
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (error) {

        console.error(
            "Webhook error:",
            error
        );

        return new Response(
            JSON.stringify({
                error: "Something went wrong.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
});