import { NextResponse } from "next/server";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/email";
import { PrismaClient } from "@/generated/prisma";

// Initialize Prisma client
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    console.log("API route called");
    const data = await request.json();
    console.log("Received form data:", data);

    // Save data to the database
    try {
      // Create a new client record using raw SQL
      const clientResult = await prisma.$executeRaw`
        INSERT INTO "Client" (
          "id",
          "businessName",
          "website",
          "industry",
          "contactName",
          "contactEmail",
          "contactPhone",
          "preferredContact",
          "newsletterConsent",
          "createdAt"
        )
        VALUES (
          gen_random_uuid(),
          ${data.businessName},
          ${data.website || null},
          ${data.industry},
          ${data.contactName},
          ${data.contactEmail},
          ${data.contactPhone},
          ${data.preferredContact},
          ${data.newsletterConsent || false},
          NOW()
        )
      `;

      console.log("Client created, rows affected:", clientResult);

      // Get the client ID
      const clients = (await prisma.$queryRaw`
        SELECT * FROM "Client"
        WHERE "contactEmail" = ${data.contactEmail}
        ORDER BY "createdAt" DESC
        LIMIT 1
      `) as any[];

      if (clients.length === 0) {
        throw new Error("Failed to retrieve client ID after creation");
      }

      const client = clients[0];
      console.log("Client retrieved:", client);

      // Create a form submission record linked to the client
      const formSubmissionResult = await prisma.$executeRaw`
        INSERT INTO "FormSubmission" (
          "id",
          "clientId",
          "formData",
          "submittedAt"
        )
        VALUES (
          gen_random_uuid(),
          ${client.id}::uuid,
          ${JSON.stringify(data)},
          NOW()
        )
      `;

      console.log(
        "Form submission created, rows affected:",
        formSubmissionResult
      );

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

      return NextResponse.json({
        success: true,
        id: client.id,
        message: "Form submitted successfully",
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        {
          error: "Database error",
          details: dbError instanceof Error ? dbError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      {
        error: "Failed to submit form",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    // Disconnect from the database to prevent connection leaks
    await prisma.$disconnect();
  }
}
