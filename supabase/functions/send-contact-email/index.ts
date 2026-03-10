import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  serviceInterest: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, phone, serviceInterest, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email for:", name, email);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Leadership by Design <onboarding@resend.dev>",
      to: ["kevin@kevinbritz.com", "lauren@kevinbritz.com"],
      replyTo: email,
      subject: `New Contact Form Submission - ${serviceInterest}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #1a365d; padding: 30px 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <strong style="color: #1a365d;">Name:</strong>
                            <span style="color: #333333; margin-left: 10px;">${name}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <strong style="color: #1a365d;">Email:</strong>
                            <span style="color: #333333; margin-left: 10px;">${email}</span>
                          </td>
                        </tr>
                        ${company ? `
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <strong style="color: #1a365d;">Company:</strong>
                            <span style="color: #333333; margin-left: 10px;">${company}</span>
                          </td>
                        </tr>
                        ` : ''}
                        ${phone ? `
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <strong style="color: #1a365d;">Phone:</strong>
                            <span style="color: #333333; margin-left: 10px;">${phone}</span>
                          </td>
                        </tr>
                        ` : ''}
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <strong style="color: #1a365d;">Service Interest:</strong>
                            <span style="color: #333333; margin-left: 10px;">${serviceInterest}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 20px; padding-bottom: 10px;">
                            <strong style="color: #1a365d;">Message:</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; color: #333333; line-height: 1.6;">
                            ${message.replace(/\n/g, '<br>')}
                          </td>
                        </tr>
                      </table>
                      <!-- Bulletproof Reply Button -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                        <tr>
                          <td align="center">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="mailto:${email}" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="10%" strokecolor="#c9a227" fillcolor="#c9a227">
                              <w:anchorlock/>
                              <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Reply to ${name}</center>
                            </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-->
                            <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate;">
                              <tr>
                                <td style="background-color: #c9a227; border-radius: 6px; text-align: center;">
                                  <a href="mailto:${email}" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px; border: 1px solid #c9a227;">Reply to ${name}</a>
                                </td>
                              </tr>
                            </table>
                            <!--<![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0; color: #6c757d; font-size: 14px;">This email was sent from the Leadership by Design contact form.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    // Send auto-reply confirmation to the user
    const userEmailResponse = await resend.emails.send({
      from: "Leadership by Design <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Leadership by Design",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #1a365d; padding: 30px 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Thank You for Reaching Out</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Dear ${name},</p>
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for contacting Leadership by Design. We have received your enquiry about <strong>${serviceInterest}</strong> and will respond within 24-48 hours.</p>
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">In the meantime, feel free to explore our programmes and resources.</p>
                      <!-- Bulletproof CTA Button -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://leadershipbydesign.co/programmes" style="height:50px;v-text-anchor:middle;width:220px;" arcsize="10%" strokecolor="#c9a227" fillcolor="#c9a227">
                              <w:anchorlock/>
                              <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">View Our Programmes</center>
                            </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-->
                            <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: separate;">
                              <tr>
                                <td style="background-color: #c9a227; border-radius: 6px; text-align: center;">
                                  <a href="https://leadershipbydesign.co/programmes" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px; border: 1px solid #c9a227;">View Our Programmes</a>
                                </td>
                              </tr>
                            </table>
                            <!--<![endif]-->
                          </td>
                        </tr>
                      </table>
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">Warm regards,<br><strong style="color: #1a365d;">The Leadership by Design Team</strong></p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">Leadership by Design</p>
                      <p style="margin: 0; color: #6c757d; font-size: 12px;">
                        <a href="https://leadershipbydesign.co" style="color: #c9a227; text-decoration: none;">leadershipbydesign.co</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(JSON.stringify({ admin: adminEmailResponse, user: userEmailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
