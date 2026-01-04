import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
// @ts-ignore - pg types issue
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set in environment variables');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing existing bookings, rooms, and room types...');
  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.roomType.deleteMany({});
  
  console.log('Creating 5 room types...');
  
  const roomTypeData = [
    {
      typeKey: "roomType1",
      descKey: "roomType1Desc",
      price: 450,
      size: 40,
      guests: 2,
      beds: "1",
      image: "/images/rooms/deluxe-room.jpg",
      features: ["Wi-Fi", "TV", "Minibar", "AC", "Sea View", "Balcony"],
      roomNumbers: ["101", "102"],
    },
    {
      typeKey: "roomType2",
      descKey: "roomType2Desc",
      price: 650,
      size: 55,
      guests: 2,
      beds: "1",
      image: "/images/rooms/luxury-suite.jpg",
      features: ["Wi-Fi", "TV", "Kitchen", "Living Room", "Balcony", "Jacuzzi"],
      roomNumbers: ["201", "202"],
    },
    {
      typeKey: "roomType3",
      descKey: "roomType3Desc",
      price: 950,
      size: 80,
      guests: 4,
      beds: "2",
      image: "/images/rooms/presidential-suite.jpg",
      features: ["Wi-Fi", "TV", "Kitchen", "Living Room", "Balcony", "Dining Area", "Private Pool"],
      roomNumbers: ["301", "302"],
    },
    {
      typeKey: "roomType4",
      descKey: "roomType4Desc",
      price: 750,
      size: 60,
      guests: 4,
      beds: "2",
      image: "/images/rooms/family-room.jpg",
      features: ["Wi-Fi", "TV", "Extra Beds", "Seating Area", "AC", "Family Friendly"],
      roomNumbers: ["401", "402"],
    },
    {
      typeKey: "roomType5",
      descKey: "roomType5Desc",
      price: 1200,
      size: 100,
      guests: 2,
      beds: "1",
      image: "/images/rooms/honeymoon-suite.jpg",
      features: ["Wi-Fi", "TV", "Jacuzzi", "Romantic Setup", "Balcony", "Minibar", "Private Terrace"],
      roomNumbers: ["501", "502"],
    },
  ];
  
  // Create room types first
  for (const typeData of roomTypeData) {
    const { roomNumbers, ...roomTypeFields } = typeData;
    
    // Create RoomType
    const roomType = await prisma.roomType.create({
      data: roomTypeFields,
    });
    
    // Create 2 rooms for each room type
    for (const roomNumber of roomNumbers) {
      await prisma.room.create({
        data: {
          roomTypeId: roomType.id,
          roomNumber: roomNumber,
        },
      });
    }
  }
  
  console.log(`Seeding completed! 5 room types and 10 rooms added successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

