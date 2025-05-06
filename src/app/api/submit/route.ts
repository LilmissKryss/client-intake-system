import { NextResponse } from "next/server";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    console.log("API route called");
    const data = await request.json();
    console.log("Received form data:", data);

    // Generate a mock ID for development
    const mockId = `dev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Log the data that would be saved to the database
    console.log("Would save to database:", {
      businessName: data.businessName,
      website: data.website || "",
      industry: data.industry,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      preferredContact: data.preferredContact,
      newsletterConsent: data.newsletterConsent,
      createdAt: new Date(),
    });

    console.log("Would save form submission:", {
      clientId: mockId,
      formData: JSON.stringify(data),
      submittedAt: new Date(),
    });

    console.log("Mock database entries created successfully");

    // Send emails (if configured)
    try {
      // Only attempt to send emails if we're not using example.com email settings
      if (
        process.env.EMAIL_HOST !== "smtp.example.com" &&
        process.env.EMAIL_USER !== "your-email@example.com"
      ) {
        await sendConfirmationEmail(
          data.contactEmail,
          data.contactName,
          data.businessName
        );
        await sendNotificationEmail(data);
        console.log("Email sent successfully");
      } else {
        console.log(
          "Skipping email sending - using example email configuration"
        );
      }
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Continue processing even if emails fail
    }

    // Always return success in development mode
    return NextResponse.json({
      success: true,
      id: mockId,
      message: "Form submitted successfully (development mode)",
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      {
        error: "Failed to submit form",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
