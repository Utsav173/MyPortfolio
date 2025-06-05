import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import nodemailer from "nodemailer";

const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
const GMAIL_PASS = process.env.GMAIL_PASS;
const RECEIVER_EMAIL = process.env.CONTACT_FORM_RECEIVER_EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASS,
  },
});

function createHtmlEmail(name: string, email: string, message: string): string {
  const cleanMessage = message
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/\n/g, "<br>");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7; }
        .container { max-width: 600px; margin: 20px auto; padding: 25px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #007bff; color: #fff; padding: 15px 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 25px 0; }
        .content p { margin-bottom: 15px; }
        .label { font-weight: 600; color: #555; }
        .message-box { background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap; word-break: break-word; }
        .footer { text-align: center; margin-top: 25px; padding-top: 15px; font-size: 0.9em; color: #777; border-top: 1px solid #eee; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>New Portfolio Contact</h1></div>
        <div class="content">
          <p><span class="label">From:</span> ${name.replace(/</g, "<")}</p>
          <p><span class="label">Email:</span> <a href="mailto:${email}">${email.replace(
    /</g,
    "<"
  )}</a></p>
          <div>
            <span class="label">Message:</span>
            <div class="message-box">${cleanMessage}</div>
          </div>
        </div>
        <div class="footer"><p>This email was sent from the portfolio contact form.</p></div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  if (!GMAIL_USERNAME || !GMAIL_PASS || !RECEIVER_EMAIL) {
    console.error("Email service environment variables are not configured.");
    return NextResponse.json(
      { message: "Server error: Email configuration is incomplete." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid input.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = validationResult.data;

    const mailOptions = {
      from: `"${name} (Portfolio)" <${GMAIL_USERNAME}>`,
      to: RECEIVER_EMAIL,
      subject: `🚀 New Portfolio Contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: createHtmlEmail(name, email, message),
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Message sent successfully! I'll get back to you soon." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Contact form API error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON format." },
        { status: 400 }
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { message: "Failed to send message.", error: errorMessage },
      { status: 500 }
    );
  }
}
