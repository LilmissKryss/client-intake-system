// Script to create database tables directly
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating database tables...');
    
    // Create Client table
    try {
      console.log('\nCreating Client table...');
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Client" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "businessName" TEXT NOT NULL,
          "website" TEXT,
          "industry" TEXT NOT NULL,
          "contactName" TEXT NOT NULL,
          "contactEmail" TEXT NOT NULL,
          "contactPhone" TEXT NOT NULL,
          "preferredContact" TEXT NOT NULL,
          "newsletterConsent" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('Client table created successfully!');
    } catch (error) {
      console.error('Error creating Client table:', error);
    }
    
    // Create FormSubmission table
    try {
      console.log('\nCreating FormSubmission table...');
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "FormSubmission" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "clientId" UUID NOT NULL,
          "formData" TEXT NOT NULL,
          "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("clientId") REFERENCES "Client"("id")
        )
      `;
      console.log('FormSubmission table created successfully!');
    } catch (error) {
      console.error('Error creating FormSubmission table:', error);
    }
    
    console.log('\nDatabase tables creation complete!');
    
  } catch (error) {
    console.error('Database tables creation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
