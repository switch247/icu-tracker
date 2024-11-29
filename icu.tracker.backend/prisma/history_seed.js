const { PrismaClient } = require('@prisma/client');
const { subDays } = require('date-fns');

const prisma = new PrismaClient();

async function main() {
    const hospitals = await prisma.hospital.findMany();

    const histories = [];
    const today = new Date();

    for (const hospital of hospitals) {
        for (let i = 0; i < 4; i++) {
            const date = subDays(today, i);
            histories.push({
                hospitalId: hospital.id,
                date: date,
                totalBeds: hospital.bedCapacity,
                icuBeds: hospital.icuBeds,
                availableIcuBeds: hospital.availableIcuBeds,
                nonFunctionalBeds: hospital.nonFunctionalBeds,
            });
        }
    }

    await prisma.icuHistory.createMany({
        data: histories,
    });

    console.log('History records created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });