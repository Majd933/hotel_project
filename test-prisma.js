require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET');

try {
  const prisma = new PrismaClient();
  console.log('✅ Prisma Client created successfully');
  
  async function test() {
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful!');
      
      const count = await prisma.room.count();
      console.log(`✅ Rooms table exists! Count: ${count}`);
      
      if (count > 0) {
        const rooms = await prisma.room.findMany({ take: 1 });
        console.log('Sample room:', {
          id: rooms[0].id,
          typeKey: rooms[0].typeKey,
          price: rooms[0].price
        });
      } else {
        console.log('No rooms found - database is empty');
      }
      
    } catch (error) {
      console.error('❌ Database query failed:', error.message);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  test();
} catch (error) {
  console.error('❌ Failed to create Prisma Client:', error.message);
  process.exit(1);
}

