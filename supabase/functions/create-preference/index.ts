// Supabase Edge Function: create-preference
// Crea una preferencia de pago en Mercado Pago y devuelve la URL de checkout
//
// Variables de entorno requeridas:
//   MERCADO_PAGO_ACCESS_TOKEN  — Access Token de Mercado Pago (producción)
//   SITE_URL                   — URL del sitio (ej: https://pagina-web-yesems.vercel.app)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req: Request) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    })
  }

  try {
    const { email, plan } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email requerido' }), {
        status: 400,
        headers,
      })
    }

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'Mercado Pago no configurado' }),
        { status: 500, headers },
      )
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'https://pagina-web-yesems.vercel.app'

    // Crear preferencia en Mercado Pago
    const preference = {
      items: [
        {
          id: plan || 'acredita-bach',
          title: 'Acredita-Bach · YES EMS',
          description: 'Curso completo de preparación para el examen CENEVAL Acredita-Bach',
          quantity: 1,
          currency_id: 'MXN',
          unit_price: 50,
        },
      ],
      payer: {
        email,
      },
      back_urls: {
        success: `${siteUrl}/acredita-bach.html?payment=success`,
        failure: `${siteUrl}/acredita-bach.html?payment=failure`,
        pending: `${siteUrl}/acredita-bach.html?payment=pending`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify({ email, plan: plan || 'acredita-bach' }),
      notification_url: `${siteUrl}/api/mercadopago-webhook`, // también se envía IPN aquí
      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
    }

    const mpResponse = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(preference),
      },
    )

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text()
      console.error('Mercado Pago error:', mpResponse.status, errorText)
      return new Response(
        JSON.stringify({
          error: 'Error al crear preferencia de pago',
          detail: errorText,
        }),
        { status: 502, headers },
      )
    }

    const mpData = await mpResponse.json()

    return new Response(
      JSON.stringify({
        preference_id: mpData.id,
        init_point: mpData.init_point,
        sandbox_init_point: mpData.sandbox_init_point,
      }),
      { status: 200, headers },
    )
  } catch (err) {
    console.error('Error interno:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers },
    )
  }
})
