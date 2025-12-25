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
  
  const imageUrl = "https://zvljofpgzjektmposucx.supabase.co/storage/v1/object/sign/hotel_bucket/first_room.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMDA2NWNkZC00M2YzLTQxNTEtOTA5ZC0wOWI4MWMyY2NmMzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJob3RlbF9idWNrZXQvZmlyc3Rfcm9vbS5qcGciLCJpYXQiOjE3NjY2OTE0OTYsImV4cCI6MTc2NzI5NjI5Nn0.7daTLCP3dJHwSZyEMs2dAqPWXJi6uKXb73q8lkmL6ng";
  
  const rooms = [
    {
      typeKey: "roomType1",
      descKey: "roomType1Desc",
      price: 450,
      size: 40,
      guests: 2,
      beds: "1",
      image: imageUrl,
      features: ["Wi-Fi", "TV", "Minibar", "AC", "Sea View", "Balcony"],
    },
    {
      typeKey: "roomType2",
      descKey: "roomType2Desc",
      price: 650,
      size: 55,
      guests: 2,
      beds: "1",
      image: imageUrl,
      features: ["Wi-Fi", "TV", "Kitchen", "Living Room", "Balcony", "Jacuzzi"],
    },
    {
      typeKey: "roomType3",
      descKey: "roomType3Desc",
      price: 950,
      size: 80,
      guests: 4,
      beds: "2",
      image: imageUrl,
      features: ["Wi-Fi", "TV", "Kitchen", "Living Room", "Balcony", "Dining Area", "Private Pool"],
    },
    {
      typeKey: "roomType4",
      descKey: "roomType4Desc",
      price: 750,
      size: 60,
      guests: 4,
      beds: "2",
      image: imageUrl,
      features: ["Wi-Fi", "TV", "Extra Beds", "Seating Area", "AC", "Family Friendly"],
    },
    {
      typeKey: "roomType5",
      descKey: "roomType5Desc",
      price: 1200,
      size: 100,
      guests: 2,
      beds: "1",
      image: imageUrl,
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

