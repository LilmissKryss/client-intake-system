// Script to check the database for client data
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database connection...');
    
    // List all available models on the Prisma client
    console.log('Available models on Prisma client:');
    console.log(Object.keys(prisma));
    
    // Try to query clients
    try {
      console.log('\nAttempting to query clients...');
      const clients = await prisma.$queryRaw`SELECT * FROM "Client" LIMIT 10`;
      console.log(`Found ${clients.length} clients:`);
      console.log(JSON.stringify(clients, null, 2));
    } catch (error) {
      console.error('Error querying clients:', error);
    }
    
    // Try to query form submissions
    try {
      console.log('\nAttempting to query form submissions...');
      const submissions = await prisma.$queryRaw`SELECT * FROM "FormSubmission" LIMIT 10`;
      console.log(`Found ${submissions.length} form submissions:`);
      console.log(JSON.stringify(submissions, null, 2));
    } catch (error) {
      console.error('Error querying form submissions:', error);
    }
    
  } catch (error) {
    console.error('Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
