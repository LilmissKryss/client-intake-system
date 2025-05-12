// Script to insert test data into the database
const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Inserting test data into the database...");

    // Insert a test client
    const testClient = await prisma.$executeRaw`
      INSERT INTO "Client" (
        "id",
        "businessName",
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
        'Test Business',
        'Technology',
        'Test User',
        'test@example.com',
        '555-123-4567',
        'email',
        false,
        NOW()
      )
      RETURNING "id"
    `;

    console.log("Test client inserted:", testClient);

    // Get the client ID
    const clients = await prisma.$queryRaw`
      SELECT * FROM "Client"
      WHERE "businessName" = 'Test Business'
      ORDER BY "createdAt" DESC
      LIMIT 1
    `;

    if (clients.length > 0) {
      const clientId = clients[0].id;
      console.log("Client ID:", clientId);

      // Insert a test form submission
      const testFormData = {
        businessName: "Test Business",
        industry: "Technology",
        contactName: "Test User",
        contactEmail: "test@example.com",
        contactPhone: "555-123-4567",
        preferredContact: "email",
        websitePurpose: "informational",
        targetAudience: "general",
        budgetRange: "1000-3000",
        timeline: "flexible",
        domainStatus: "need-to-purchase",
        hostingPreference: "recommend",
        maintenanceNeeds: "monthly",
        newsletterConsent: false,
      };

      await prisma.$executeRaw`
        INSERT INTO "FormSubmission" (
          "id",
          "clientId",
          "formData",
          "submittedAt"
        )
        VALUES (
          gen_random_uuid(),
          ${clientId}::uuid,
          ${JSON.stringify(testFormData)},
          NOW()
        )
      `;

      console.log("Test form submission inserted!");
    } else {
      console.log("Could not find the inserted client.");
    }

    console.log("\nTest data insertion complete!");
  } catch (error) {
    console.error("Error inserting test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
