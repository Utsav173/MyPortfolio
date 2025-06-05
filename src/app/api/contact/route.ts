import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import nodemailer from "nodemailer";

const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
const GMAIL_PASS = process.env.GMAIL_PASS;
const receiverEmail = process.env.CONTACT_FORM_RECEIVER_EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASS,
  },
});

function createBeautifulHtmlEmail(
  name: string,
  email: string,
  message: string,
  portfolioName: string = "My Portfolio"
): string {
  const escapedName = name.replace(/</g, "<").replace(/>/g, ">");
  const escapedEmail = email.replace(/</g, "<").replace(/>/g, ">");
  const escapedMessage = message
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
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 25px;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
            .header {
                background-color: #007bff;
                color: #ffffff;
                padding: 15px 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px 0;
            }
            .content p {
                margin-bottom: 15px;
            }
            .label {
                font-weight: bold;
                color: #555555;
            }
            .message-box {
                background-color: #f9f9f9;
                border: 1px solid #eeeeee;
                padding: 15px;
                border-radius: 4px;
                margin-top: 5px;
                white-space: pre-wrap;
            }
            .footer {
                text-align: center;
                margin-top: 25px;
                padding-top: 15px;
                font-size: 0.9em;
                color: #777777;
                border-top: 1px solid #eeeeee;
            }
            a {
                color: #007bff;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Contact from ${portfolioName}</h1>
            </div>
            <div class="content">
                <p><span class="label">From:</span> ${escapedName}</p>
                <p><span class="label">Email:</span> <a href="mailto:${escapedEmail}">${escapedEmail}</a></p>
                <div>
                    <span class="label">Message:</span>
                    <div class="message-box">${escapedMessage}</div>
                </div>
            </div>
            <div class="footer">
                <p>This email was sent via the contact form on your portfolio website.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  if (
    !GMAIL_USERNAME ||
    !GMAIL_PASS ||
    !receiverEmail ||
    receiverEmail === "your-personal-email@example.com"
  ) {
    console.error(
      "Email sending environment variables are not fully configured for Nodemailer."
    );
    return NextResponse.json(
      {
        message:
          "Server configuration error for sending emails. Please contact the administrator.",
      },
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
      to: receiverEmail,
      subject: `🚀 New Portfolio Contact: ${name}`,
      replyTo: email,
      text: `You have a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: createBeautifulHtmlEmail(
        name,
        email,
        message,
        "Utsav Khatri's Portfolio"
      ),
    };

    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json(
        { message: "Message sent successfully! I will get back to you soon." },
        { status: 200 }
      );
    } catch (emailError: any) {
      console.error("Nodemailer error sending email:", emailError);
      return NextResponse.json(
        {
          message: "Failed to send message due to an email service error.",
          errorDetails: emailError.message || "Unknown Nodemailer error",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Contact form API error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request body. Please ensure it is valid JSON." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message:
          "An unexpected error occurred on the server. Please try again later.",
      },
      { status: 500 }
    );
  }
}
