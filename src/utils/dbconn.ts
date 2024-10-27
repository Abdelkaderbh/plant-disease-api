import prisma from './db';

export default async function testDatabaseConnection() {
    try {
      await prisma.$connect();
      console.log('🟢 Database connection successful');
    } catch (error) {
      console.error('🔴 Database connection failed:', error);
      process.exit(1);
    }
  }