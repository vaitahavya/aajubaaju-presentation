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

  const { 
    client_name, 
    client_email, 
    payment_proof_url, 
    client_address, 
    client_phone, 
    client_rep, 
    client_sign_date,
    signature_data_url 
  } = await req.json()

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
    subject: '🎬 New Aajubaaju.in Agreement Signed - SreeDrisya Media',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #1E3A8A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🎬 New Agreement Signed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Aajubaaju.in - 30-Minute Concept Story Film</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1E3A8A; margin-top: 0;">Client Information</h2>
          
          <div style="margin-bottom: 20px;">
            <p><strong style="color: #333;">Client Name:</strong> <span style="color: #666;">${client_name}</span></p>
            <p><strong style="color: #333;">Client Email:</strong> <span style="color: #666;">${client_email}</span></p>
            <p><strong style="color: #333;">Client Phone:</strong> <span style="color: #666;">${client_phone}</span></p>
            <p><strong style="color: #333;">Client Address:</strong> <span style="color: #666;">${client_address}</span></p>
            <p><strong style="color: #333;">Client Representative:</strong> <span style="color: #666;">${client_rep}</span></p>
            <p><strong style="color: #333;">Sign Date:</strong> <span style="color: #666;">${client_sign_date}</span></p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1E3A8A;">Attachments</h3>
            <p><strong>Payment Proof:</strong> <a href="${payment_proof_url}" style="color: #1E3A8A; text-decoration: none;">📎 View Payment Proof</a></p>
            ${signature_data_url ? `<p><strong>Client Signature:</strong> <a href="${signature_data_url}" style="color: #1E3A8A; text-decoration: none;">✍️ View Signature</a></p>` : ''}
          </div>
          
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 6px; border-left: 4px solid #1E3A8A;">
            <p style="margin: 0; color: #1E3A8A;"><strong>Next Steps:</strong></p>
            <ul style="margin: 10px 0 0 0; color: #666;">
              <li>Review the agreement details</li>
              <li>Verify payment proof</li>
              <li>Begin project planning</li>
            </ul>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
            <p style="margin: 0;">This email was sent automatically from the Aajubaaju.in agreement system.</p>
            <p style="margin: 5px 0 0 0;">SreeDrisya Media - Where Strategy Meets Storytelling</p>
          </div>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Email sending error:', err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
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
