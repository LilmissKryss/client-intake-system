// Script to check and setup the database
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database connection...');
    
    // Check if the database is accessible
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful!');
    } catch (error) {
      console.error('Database connection failed:', error);
      console.log('\nPlease check your DATABASE_URL in .env.local file and make sure PostgreSQL is running.');
      return;
    }
    
    // Check if tables exist
    try {
      console.log('\nChecking if tables exist...');
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      console.log('Tables found in database:');
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
      
      // Check if Client and FormSubmission tables exist
      const clientTableExists = tables.some(table => table.table_name === 'Client');
      const formSubmissionTableExists = tables.some(table => table.table_name === 'FormSubmission');
      
      if (!clientTableExists || !formSubmissionTableExists) {
        console.log('\nRequired tables are missing. You need to run Prisma migrations:');
        console.log('npx prisma migrate dev --name init');
      } else {
        console.log('\nAll required tables exist!');
      }
    } catch (error) {
      console.error('Error checking tables:', error);
    }
    
  } catch (error) {
    console.error('Database setup check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
