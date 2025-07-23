import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
  console.log('Provide RESEND_API inside the .env file');
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    console.log('Sending email to:', sendTo);
    console.log('Subject:', subject);
    console.log('HTML:', html);

    const data = await resend.emails.send({
      from: 'Blinkit <onboarding@resend.dev>',
      to: sendTo,
      subject,
      html,
    });

    console.log('Email sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
