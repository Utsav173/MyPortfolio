import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import nodemailer from 'nodemailer';

const GMAIL_USERNAME = process.env.GMAIL_USERNAME 
const GMAIL_PASS = process.env.GMAIL_PASS 
const receiverEmail = process.env.CONTACT_FORM_RECEIVER_EMAIL

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASS,
  },
});

export async function POST(request: Request) {
  if (!GMAIL_USERNAME || !GMAIL_PASS || !receiverEmail || receiverEmail === 'your-personal-email@example.com') {
    console.error('Email sending environment variables are not fully configured for Nodemailer.');
    return NextResponse.json(
      { message: 'Server configuration error for sending emails. Please contact the administrator.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Invalid input.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = validationResult.data;

    const mailOptions = {
      from: `"${name}" <${GMAIL_USERNAME}>`,
      to: receiverEmail,
      subject: `New Portfolio Contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json(
        { message: 'Message sent successfully! I will get back to you soon.' },
        { status: 200 }
      );
    } catch (emailError: any) {
      console.error('Nodemailer error sending email:', emailError);
      return NextResponse.json(
        {
          message: 'Failed to send message due to an email service error.',
          errorDetails: emailError.message || 'Unknown Nodemailer error',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Contact form API error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Invalid request body. Please ensure it is valid JSON.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'An unexpected error occurred on the server. Please try again later.' },
      { status: 500 }
    );
  }
}