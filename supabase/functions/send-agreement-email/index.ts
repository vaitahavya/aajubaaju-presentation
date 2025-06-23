// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createTransport } from 'npm:nodemailer'

console.log("Hello from Functions!")

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { clientName, clientEmail, paymentProofUrl, clientAddress, clientPhone, clientRep, clientSignDate } = await req.json()

  // Use environment variables for Gmail credentials
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: Deno.env.get('GMAIL_USER'),
      pass: Deno.env.get('GMAIL_PASS')
    }
  })

  const mailOptions = {
    from: Deno.env.get('GMAIL_USER'),
    to: 'vaitahavya@sreedrisyamedia.com',
    subject: 'New Agreement Signed',
    html: `
      <h2>New Agreement Signed</h2>
      <p><b>Client Name:</b> ${clientName}</p>
      <p><b>Client Email:</b> ${clientEmail}</p>
      <p><b>Client Address:</b> ${clientAddress}</p>
      <p><b>Client Phone:</b> ${clientPhone}</p>
      <p><b>Client Representative:</b> ${clientRep}</p>
      <p><b>Client Sign Date:</b> ${clientSignDate}</p>
      <p><b>Payment Proof:</b> <a href="${paymentProofUrl}">View File</a></p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return new Response(JSON.stringify({ message: 'Email sent!' }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-agreement-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
