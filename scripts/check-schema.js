// Script to check the database schema
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database schema...');
    
    // Check Client table schema
    try {
      console.log('\nChecking Client table schema:');
      const clientColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'Client'
        ORDER BY ordinal_position
      `;
      
      console.log('Client table columns:');
      clientColumns.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type}, ${column.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
    } catch (error) {
      console.error('Error checking Client table schema:', error);
    }
    
    // Check FormSubmission table schema
    try {
      console.log('\nChecking FormSubmission table schema:');
      const formSubmissionColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'FormSubmission'
        ORDER BY ordinal_position
      `;
      
      console.log('FormSubmission table columns:');
      formSubmissionColumns.forEach(column => {
        console.log(`- ${column.column_name} (${column.data_type}, ${column.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
    } catch (error) {
      console.error('Error checking FormSubmission table schema:', error);
    }
    
  } catch (error) {
    console.error('Database schema check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
