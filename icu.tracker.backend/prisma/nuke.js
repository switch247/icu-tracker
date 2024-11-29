const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteHospitalsNotMatching() {
  await prisma.hospital.deleteMany({
    where: {
      NOT: {
        OR: [{ address: '123 Main St' }, { address: '456 Elm St' }],
      },
    },
  });
  console.log('Hospitals not matching the specified address and name deleted.');
}

deleteHospitalsNotMatching()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
