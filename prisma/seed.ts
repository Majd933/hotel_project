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
  console.log('Clearing existing rooms...');
  await prisma.room.deleteMany({});
  
  console.log('Seeding 5 star hotel rooms...');
  
  const rooms = [
    {
      typeKey: "roomType1",
      descKey: "roomType1Desc",
      price: 450,
      size: 40,
      guests: 2,
      beds: "1",
      image: "/images/rooms/deluxe-room.jpg",
      features: ["Wi-Fi", "TV", "Minibar", "AC", "Sea View", "Balcony"],
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
    },
  ];
  
  for (const room of rooms) {
    await prisma.room.create({
      data: room,
    });
  }
  
  console.log(`Seeding completed! ${rooms.length} rooms added successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

