// Supabase Edge Function: mercadopago-webhook
// Recibe notificaciones IPN de Mercado Pago y registra el acceso
//
// Variables de entorno requeridas:
//   MERCADO_PAGO_ACCESS_TOKEN    — Access Token de Mercado Pago
//   SUPABASE_URL                 — URL del proyecto Supabase
//   SUPABASE_SERVICE_ROLE_KEY    — Service Role Key de Supabase

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req: Request) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  try {
    // Mercado Pago envía el webhook como POST con tipo de notificación
    const body = await req.json()

    console.log('Webhook recibido:', JSON.stringify(body))

    const { type, data } = body

    // Solo procesamos pagos
    if (type !== 'payment' || !data?.id) {
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        status: 200,
        headers,
      })
    }

    const paymentId = data.id
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')

    if (!accessToken) {
      console.error('MERCADO_PAGO_ACCESS_TOKEN no configurado')
      return new Response(JSON.stringify({ error: 'No configurado' }), {
        status: 500,
        headers,
      })
    }

    // Obtener detalle del pago desde Mercado Pago
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (!mpResponse.ok) {
      console.error('Error al obtener pago:', mpResponse.status)
      return new Response(JSON.stringify({ error: 'Error al verificar pago' }), {
        status: 502,
        headers,
      })
    }

    const payment = await mpResponse.json()

    console.log('Pago obtenido:', JSON.stringify({ id: payment.id, status: payment.status, external_reference: payment.external_reference }))

    // Solo procesar pagos aprobados
    if (payment.status !== 'approved') {
      return new Response(JSON.stringify({ ok: true, status: payment.status }), {
        status: 200,
        headers,
      })
    }

    // Extraer email y plan de external_reference
    let email = payment.payer?.email || ''
    let plan = 'acredita-bach'

    try {
      const ref = JSON.parse(payment.external_reference || '{}')
      email = ref.email || email
      plan = ref.plan || plan
    } catch {
      // external_reference no es JSON, usar email del payer
    }

    if (!email) {
      console.error('No se pudo determinar el email del comprador')
      return new Response(JSON.stringify({ error: 'Email no encontrado' }), {
        status: 400,
        headers,
      })
    }

    // Registrar acceso en Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados')
      return new Response(JSON.stringify({ error: 'Supabase no configurado' }), {
        status: 500,
        headers,
      })
    }

    // Calcular fecha de expiración (1 año por defecto)
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const accessRecord = {
      email,
      plan,
      access_granted: true,
      payment_id: String(paymentId),
      payment_status: payment.status,
      expires_at: expiresAt.toISOString(),
    }

    // Insertar o actualizar si ya existe un registro para ese email
    const sbResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_access?email=eq.${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    )

    const existing = await sbResponse.json()

    if (Array.isArray(existing) && existing.length > 0) {
      // Actualizar registro existente
      await fetch(
        `${supabaseUrl}/rest/v1/user_access?email=eq.${encodeURIComponent(email)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify(accessRecord),
        },
      )
    } else {
      // Crear nuevo registro
      await fetch(`${supabaseUrl}/rest/v1/user_access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(accessRecord),
      })
    }

    console.log(`Acceso registrado para ${email} (pago ${paymentId})`)

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
  } catch (err) {
    console.error('Error en webhook:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers,
    })
  }
})
