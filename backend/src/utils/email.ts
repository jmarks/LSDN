import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: any;
}

export async function sendEmail(emailData: EmailData): Promise<void> {
  const { to, subject, template, data } = emailData;

  // Skip sending emails in development if SMTP is not configured
  if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
    console.log('Email sending disabled in development mode');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    return;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Load and compile template
    const templatePath = path.join(__dirname, '../templates', `${template}.hbs`);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateContent);

    // Render email content
    const html = compiledTemplate(data);

    // Send email
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't rethrow - continue with registration even if email fails
  }
}