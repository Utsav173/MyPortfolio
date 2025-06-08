function sanitizeHtml(text: string): string {
  return text.replace(/</g, '<').replace(/>/g, '>');
}

export function createHtmlEmail(name: string, email: string, message: string): string {
  const cleanName = sanitizeHtml(name);
  const cleanEmail = sanitizeHtml(email);
  const cleanMessage = sanitizeHtml(message).replace(/\n/g, '<br>');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7; }
        .container { max-width: 600px; margin: 20px auto; padding: 25px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #007bff; color: #ffffff; padding: 15px 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 25px 0; }
        .content p { margin-bottom: 15px; }
        .label { font-weight: 600; color: #555555; }
        .message-box { background-color: #f9f9f9; border: 1px solid #eeeeee; padding: 15px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap; word-break: break-word; }
        .footer { text-align: center; margin-top: 25px; padding-top: 15px; font-size: 0.9em; color: #777777; border-top: 1px solid #eeeeee; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>New Portfolio Contact</h1></div>
        <div class="content">
          <p><span class="label">From:</span> ${cleanName}</p>
          <p><span class="label">Email:</span> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
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
