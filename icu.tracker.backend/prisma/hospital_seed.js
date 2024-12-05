// https://github.com/HEARTS-Care/icu-tracker.git

const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Load the Excel file
    const filePath = path.join(__dirname, 'ICUSurveyAssessment_Data1.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const {
        'Name of the hospital': Name,
        'Address of the hopsital ': Address,
        Regions: Region,
        'Type of the hospital': Type,
        'Level of the hospital': Level,
        'Hospital bed capacity (total/including non-ICU)': BedCapacity,
        'How many beds are available in all the ICUs ?': Available_ICU_Beds,
        'Number of beds currently closed (not functional)': NonFunctionalBeds,
        'Does the hospital have advanced ambulance services to accept critically ill patients from other hospitals or refer them to other hospitals?':
        AdvancedAmbulanceServices,
      } = row;
      var ICU_Beds =
        parseInt(BedCapacity, 10) -
        (parseInt(Available_ICU_Beds, 10) + parseInt(NonFunctionalBeds, 10));
      console.log(row);
      // Create or upsert hospitals
      await prisma.hospital.create({
        data: {
          name: Name,
          address: Address ?? 'N/A',
          region: Region,
          type: Type.toUpperCase(), // Ensure type matches enum
          level: Level.split(' ')[0].toUpperCase(), // Ensure level matches enum
          bedCapacity: parseInt(BedCapacity, 10),
          icuBeds: ICU_Beds,
          availableIcuBeds: parseInt(Available_ICU_Beds, 10),
          nonFunctionalBeds: parseInt(NonFunctionalBeds, 10),
          advancedAmbulanceServices: AdvancedAmbulanceServices === 'Yes',
        },
      });
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// seedDatabase();




// Function to extract latitude and longitude from a URL
function extractLatLong(url) {
  const regex = /@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/;
  const match = url.match(regex);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return [null, null];
}

// Function to update hospitals with latitude and longitude

async function updateHospitalCoordinates() {
  const hospitals = await prisma.hospital.findMany();

  for (const hospital of hospitals) {
    const { address } = hospital;
    const [latitude, longitude] = extractLatLong(address);

    // Update the hospital record if latitude and longitude are found
    if (latitude !== null && longitude !== null) {
      await prisma.hospital.update({
        where: { id: hospital.id },
        data: {
          latitude: latitude,
          longitude: longitude,
        },
      });
      console.log(`Updated hospital ${hospital.name} with lat: ${latitude}, long: ${longitude}`);
    }
  }
}

// Execute the function to update coordinates
updateHospitalCoordinates()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });