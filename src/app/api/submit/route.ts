import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Save to database
    const client = await prisma.client.create({
      data: {
        businessName: data.businessName,
        website: data.website || "",
        industry: data.industry,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        preferredContact: data.preferredContact,
        newsletterConsent: data.newsletterConsent,
        marketingFrequency: data.newsletterConsent
          ? data.marketingFrequency
          : null,
        createdAt: new Date(),
      },
    });

    // Save detailed form submission
    const formSubmission = await prisma.formSubmission.create({
      data: {
        clientId: client.id,
        formData: JSON.stringify(data),
        submittedAt: new Date(),
      },
    });

    // Send emails
    try {
      await sendConfirmationEmail(
        data.contactEmail,
        data.contactName,
        data.businessName
      );
      await sendNotificationEmail(data);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Continue processing even if emails fail
    }

    return NextResponse.json({
      success: true,
      id: client.id,
      message: "Form submitted successfully",
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
