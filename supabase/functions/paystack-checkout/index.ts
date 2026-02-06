import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  email: string;
  firstName: string;
  lastName: string;
  amount: number; // Amount in kobo (ZAR cents)
  productName: string;
  callbackUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }

    const { email, firstName, lastName, amount, productName, callbackUrl }: CheckoutRequest = await req.json();

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: 'Email, first name, and last name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Paystack transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount, // Amount in kobo
        callback_url: callbackUrl,
        metadata: {
          first_name: firstName,
          last_name: lastName,
          product_name: productName,
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${firstName} ${lastName}`
            },
            {
              display_name: "Product",
              variable_name: "product",
              value: productName
            }
          ]
        },
        currency: 'ZAR',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Paystack error:', data);
      throw new Error(data.message || 'Failed to initialize payment');
    }

    return new Response(
      JSON.stringify({ 
        authorization_url: data.data.authorization_url,
        reference: data.data.reference,
        access_code: data.data.access_code
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process checkout' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
