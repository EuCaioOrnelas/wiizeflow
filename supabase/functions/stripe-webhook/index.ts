
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing Stripe webhook...');
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("Stripe webhook secret not configured");
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log('Webhook event type:', event.type);

    let customerEmail = '';
    let customerId = '';
    let subscriptionId = '';
    let priceId = '';
    let sessionId = '';

    // Process different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        customerEmail = session.customer_details?.email || '';
        customerId = session.customer || '';
        sessionId = session.id;
        
        // Get subscription and price info
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          subscriptionId = subscription.id;
          priceId = subscription.items.data[0]?.price.id || '';
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        customerId = invoice.customer;
        subscriptionId = invoice.subscription || '';
        
        // Get customer email
        const customer = await stripe.customers.retrieve(customerId);
        customerEmail = customer.email || '';
        
        // Get price from subscription
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          priceId = subscription.items.data[0]?.price.id || '';
        }
        break;

      case 'customer.subscription.deleted':
      case 'invoice.payment_failed':
        const failedData = event.data.object;
        customerId = failedData.customer;
        subscriptionId = failedData.id || failedData.subscription || '';
        
        // Get customer email
        const failedCustomer = await stripe.customers.retrieve(customerId);
        customerEmail = failedCustomer.email || '';
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
    }

    console.log('Processing webhook with data:', {
      event_type: event.type,
      customer_email: customerEmail,
      customer_id: customerId,
      subscription_id: subscriptionId,
      price_id: priceId,
      session_id: sessionId
    });

    // Call Supabase function to process the webhook
    const { data, error } = await supabase.rpc('process_stripe_webhook', {
      event_type: event.type,
      customer_email: customerEmail,
      customer_id: customerId,
      subscription_id: subscriptionId,
      price_id: priceId,
      session_id: sessionId
    });

    if (error) {
      console.error('Error processing webhook in Supabase:', error);
      throw error;
    }

    console.log('Webhook processed successfully:', data);

    return new Response(JSON.stringify({ 
      received: true, 
      processed: true,
      data: data 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      received: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
