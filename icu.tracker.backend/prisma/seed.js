const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create hospitals
  const hospital1 = await prisma.hospital.create({
    data: {
      name: 'General Hospital',
      address: '123 Main St',
      latitude: 40.7128,
      longitude: -74.006,
      type: 'PUBLIC',
      level: 'TERTIARY',
      region: 'Region A',
      zone: 'Zone 1',
      bedCapacity: 200,
      icuBeds: 20,
      availableIcuBeds: 5,
      nonFunctionalBeds: 10,
      advancedAmbulanceServices: true,
    },
  });
  const saltRounds = 10;

  const hospital2 = await prisma.hospital.create({
    data: {
      name: 'Specialty Clinic',
      address: '456 Elm St',
      latitude: 34.0522,
      longitude: -118.2437,
      type: 'PRIVATE',
      level: 'PRIMARY',
      region: 'Region B',
      zone: 'Zone 2',
      bedCapacity: 50,
      icuBeds: 5,
      availableIcuBeds: 2,
      nonFunctionalBeds: 1,
      advancedAmbulanceServices: false,
    },
  });

  // Create users
  await prisma.user.createMany({
    data: [
      {
        id: 'user-super-admin', // Optionally set a custom UUID
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: await bcrypt.hash('securepassword', saltRounds),
        role: 'SUPER_ADMIN',
        isVerified: true,
      },
      {
        id: 'user-hospital-admin1',
        name: 'Hospital Admin 1',
        email: 'admin1@example.com',
        password: await bcrypt.hash('securepassword', saltRounds),
        role: 'HOSPITAL_ADMIN',
        hospitalId: hospital1.id,
      },
      {
        id: 'user-hospital-admin2',
        name: 'Hospital Admin 2',
        email: 'admin2@example.com',
        password: await bcrypt.hash('securepassword', saltRounds),
        role: 'HOSPITAL_ADMIN',
        hospitalId: hospital2.id,
      },
    ],
  });

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
