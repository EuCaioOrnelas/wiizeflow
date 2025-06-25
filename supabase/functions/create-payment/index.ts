
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing payment request...');
    
    const { priceId, customerEmail } = await req.json();
    
    console.log('Received data:', { priceId, customerEmail });
    
    if (!priceId) {
      throw new Error("Price ID is required");
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log('Stripe key exists:', !!stripeKey);
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    console.log('Creating checkout session for price:', priceId);

    // Use the provided email or fall back to a guest email
    const checkoutEmail = customerEmail && customerEmail.trim() !== "" ? customerEmail : "guest@wiizeflow.com";
    console.log('Using email for checkout:', checkoutEmail);

    // Determine plan details based on price ID
    let planName = "Plano Desconhecido";
    let amount = 0;
    
    if (priceId === "price_1RdhpHG1GdQ2ZjmFmYXfEFJa") {
      planName = "Mensal";
      amount = 4700; // R$ 47,00 em centavos
    } else if (priceId === "price_1RdhqYG1GdQ2ZjmFlAOaBr4A") {
      planName = "Anual";
      amount = 39700; // R$ 397,00 em centavos
    }

    // Create a subscription payment session
    const session = await stripe.checkout.sessions.create({
      customer_email: checkoutEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    console.log('Checkout session created:', session.id);
    console.log('Checkout URL:', session.url);

    // Initialize Supabase client with service role key to save order data
    const supabaseServiceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Try to get user ID if the email belongs to a registered user
    let userId = null;
    try {
      const { data: users, error: userError } = await supabaseServiceClient
        .from('profiles')
        .select('id')
        .eq('email', checkoutEmail)
        .limit(1);
      
      if (!userError && users && users.length > 0) {
        userId = users[0].id;
      }
    } catch (userFetchError) {
      console.log('Could not fetch user ID, continuing without it:', userFetchError);
    }

    // Save order data to database
    const { error: orderError } = await supabaseServiceClient
      .from('orders')
      .insert({
        user_id: userId,
        customer_email: checkoutEmail,
        stripe_session_id: session.id,
        price_id: priceId,
        amount: amount,
        currency: 'brl',
        status: 'pending',
        plan_name: planName
      });

    if (orderError) {
      console.error('Error saving order to database:', orderError);
      // Continue anyway - don't fail the payment process
    } else {
      console.log('Order saved to database successfully');
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment session:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
