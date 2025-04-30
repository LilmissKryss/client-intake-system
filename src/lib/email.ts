import nodemailer from "nodemailer";

// Configure transporter - replace with your actual email service config in .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "your-email@example.com",
    pass: process.env.EMAIL_PASS || "your-password",
  },
});

// Developer email (the one receiving notifications)
const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL || "you@example.com";

export async function sendConfirmationEmail(
  clientEmail: string,
  clientName: string,
  businessName: string
) {
  const message = {
    from: `"Your Web Development" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: "Thank You for Your Website Project Details",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank You, ${clientName}!</h2>
        <p>I've received your information about ${businessName} and your website needs.</p>
        <p>I'll review your requirements and will be in touch with you shortly to discuss the next steps.</p>
        <p>If you have any questions in the meantime, please don't hesitate to reach out.</p>
        <p>Best regards,<br>Your Name<br>Web Developer</p>
      </div>
    `,
  };

  return transporter.sendMail(message);
}

export async function sendNotificationEmail(formData: any) {
  const message = {
    from: `"Intake Form" <${process.env.EMAIL_USER}>`,
    to: DEVELOPER_EMAIL,
    subject: `New Project Inquiry: ${formData.businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2>New Project Inquiry</h2>
        <p><strong>Business:</strong> ${formData.businessName}</p>
        <p><strong>Contact:</strong> ${formData.contactName} (${
      formData.contactEmail
    }, ${formData.contactPhone})</p>
        <p><strong>Preferred Contact Method:</strong> ${
          formData.preferredContact
        }</p>
        <p><strong>Industry:</strong> ${formData.industry}</p>
        <p><strong>Website Purpose:</strong> ${formData.websitePurpose}</p>
        <p><strong>Budget Range:</strong> ${formData.budgetRange}</p>
        <p><strong>Timeline:</strong> ${formData.timeline}</p>
        <h3>Full Submission Details</h3>
        <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
${JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    `,
  };

  return transporter.sendMail(message);
}
