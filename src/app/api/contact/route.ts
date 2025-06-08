import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { createHtmlEmail } from "@/lib/email-template";
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

export async function POST(request: Request) {
  if (!GMAIL_USERNAME || !GMAIL_PASS || !RECEIVER_EMAIL) {
    console.error("Email service environment variables are not configured.");
    return NextResponse.json(
      { message: "Server error: Email configuration is incomplete." },
      { status: 503 },
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
        { status: 400 },
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
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Contact form API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request body. Please provide valid JSON." },
        { status: 400 },
      );
    }

    if (error instanceof Error && "code" in error) {
      const nodeMailerError = error as NodeJS.ErrnoException;
      if (nodeMailerError.code === "EAUTH") {
        return NextResponse.json(
          {
            message: "Server authentication error. Could not send the email.",
          },
          { status: 500 },
        );
      }
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown internal error occurred.";
    return NextResponse.json(
      { message: "Failed to send message.", error: errorMessage },
      { status: 500 },
    );
  }
}
