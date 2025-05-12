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
  _businessName: string // Prefixed with underscore to indicate it's not used
) {
  // Extract first name from the full name
  const firstName = clientName.split(" ")[0];

  const message = {
    from: `"Krystal Hardin" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: "Thank You for Your Submission!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <p>Hi ${firstName},</p>

        <p>Thank you for completing the intake form — I'm excited to learn more about your goals and how I can support you.</p>

        <p>I'll review your submission shortly and reach out within 24-48 hours to follow up or confirm next steps. In the meantime, feel free to reply to this email if you have any questions.</p>

        <p>Looking forward to connecting soon!</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
          <p style="margin-bottom: 5px;">Warmly,</p>
          <p style="margin-top: 0; font-weight: bold;">Krystal</p>
          <p style="margin-top: 0; color: #666;">Web Developer & Designer</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(message);
}

export async function sendNotificationEmail(formData: any) {
  // Format budget range for better readability
  const formatBudgetRange = (budget: string) => {
    switch (budget) {
      case "under1000":
        return "Under $1,000";
      case "1000-3000":
        return "$1,000 - $3,000";
      case "3000-5000":
        return "$3,000 - $5,000";
      case "5000-10000":
        return "$5,000 - $10,000";
      case "over10000":
        return "Over $10,000";
      case "undecided":
        return "Undecided/Flexible";
      default:
        return budget;
    }
  };

  // Format domain status for better readability
  const formatDomainStatus = (status: string) => {
    switch (status) {
      case "owned":
        return "Already owns a domain";
      case "need-to-purchase":
        return "Needs to purchase a domain";
      case "unsure":
        return "Not sure";
      default:
        return status;
    }
  };

  const message = {
    from: `"Client Intake System" <${process.env.EMAIL_USER}>`,
    to: DEVELOPER_EMAIL,
    subject: `New Client Inquiry: ${formData.businessName} - ${formData.industry}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2>New Client Inquiry</h2>
        <p><strong>Business:</strong> ${formData.businessName}</p>
        <p><strong>Contact:</strong> ${formData.contactName} (${
      formData.contactEmail
    }, ${formData.contactPhone})</p>
        <p><strong>Preferred Contact Method:</strong> ${
          formData.preferredContact
        }</p>
        <p><strong>Industry:</strong> ${formData.industry}</p>

        <h3>Branding Information</h3>
        <p><strong>Brand Style:</strong> ${formData.brandStyle}</p>
        <p><strong>Has Logo:</strong> ${formData.hasLogo || "Not specified"}</p>
        ${
          formData.hasLogo === "yes"
            ? "<p><strong>Logo Upload:</strong> Logo file was uploaded</p>"
            : ""
        }

        <h3>Website Requirements</h3>
        <p><strong>Website Purpose:</strong> ${formData.websitePurpose}</p>
        <p><strong>Desired Pages:</strong> ${
          formData.desiredPages || "Not specified"
        }</p>
        <p><strong>Content Ready:</strong> ${formData.contentReady}</p>
        ${
          formData.contentReady === "yes"
            ? "<p><strong>Content Upload:</strong> Content files were uploaded</p>"
            : ""
        }
        <p><strong>Desired Launch Date:</strong> ${
          formData.desiredLaunchDate || "Not specified"
        }</p>

        <h3>Technical Details</h3>
        <p><strong>Domain Status:</strong> ${formatDomainStatus(
          formData.domainStatus
        )}</p>
        ${
          formData.domainStatus === "owned"
            ? `<p><strong>Existing Domain:</strong> ${
                formData.existingDomain || "Not provided"
              }</p>`
            : ""
        }
        ${
          formData.domainStatus === "need-to-purchase"
            ? `<p><strong>Preferred Domain:</strong> ${
                formData.preferredDomain || "Not provided"
              }</p>`
            : ""
        }
        <p><strong>Hosting Preference:</strong> ${
          formData.hostingPreference
        }</p>
        ${
          formData.hostingPreference === "have-provider"
            ? `<p><strong>Existing Provider:</strong> ${
                formData.existingProvider || "Not provided"
              }</p>`
            : ""
        }

        <h3>Project Parameters</h3>
        <p><strong>Budget Range:</strong> ${formatBudgetRange(
          formData.budgetRange
        )}</p>
        <p><strong>Timeline:</strong> ${formData.timeline}</p>
        <p><strong>Maintenance Needs:</strong> ${formData.maintenanceNeeds}</p>

        <h3>Full Submission Details</h3>
        <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
${JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    `,
  };

  return transporter.sendMail(message);
}
