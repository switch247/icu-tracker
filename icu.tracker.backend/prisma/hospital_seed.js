// https://github.com/HEARTS-Care/icu-tracker.git

const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity'); // Install via `npm install string-similarity`

const prisma = new PrismaClient();

async function dropCollections() {
  try {
    const deleteResult = await prisma.icuHistory.deleteMany({});
    console.log(`Deleted ${deleteResult.count} records from icuHistory.`);
    const deleteResultx = await prisma.hospital.deleteMany({});
    console.log(`Deleted ${deleteResultx.count} records from hospitals.`);

    console.log('Collections dropped successfully.');
  } catch (error) {
    console.error('Error dropping collections:', error);
  }
}



const regionMapping = {
  'Addis Ababa': 'ADDIS_ABABA',
  'Afar Region': 'AFAR',
  'Amhara Region': 'AMHARA',
  'Benishangul-Gumuz': 'BENISHANGUL_GUMUZ',
  'Central Ethiopia region': 'CENTRAL_ETHIOPIA',
  'Diredawa': 'DIRE_DAWA',
  'Gambela Region': 'GAMBELA',
  'Harari Regional State': 'HARARI',
  'Oromia  Region': 'OROMIA',
  'Sidama Region': 'SIDAMA',
  'Somali Region': 'SOMALI',
  'South Ethiopia': 'SOUTH_ETHIOPIA',
  'Southern Nations, Nationalities, and Peoples Region': 'SOUTH_ETHIOPIA',
  'South West Ethiopia Region': 'SOUTH_WEST_ETHIOPIA_PEOPLES',
  'Tigray Region': 'TIGRAY',
};

const hospitalTypeMapping = {
  Public: 'PUBLIC',
  Private: 'PRIVATE',
  Government: 'GOVERNMENT',
  NGO: 'NGO',
};

const hospitalLevelMapping = {
  Primary: 'PRIMARY',
  General: 'GENERAL',
  Tertiary: 'TERTIARY',
};

function getFuzzyMatch(input, mapping) {
  if (!input) return null;

  // Get the best match for the input string from the mapping keys
  const matches = stringSimilarity.findBestMatch(
    input.trim(),
    Object.keys(mapping)
  );
  const { target, rating } = matches.bestMatch;

  // Return the mapped value if the similarity score is above 60%
  return rating > 0.4 ? mapping[target] : null;
}

async function seedDatabase() {
  const skippedRows = []; // Array to store skipped rows
  const validRows = []; // Array to store valid rows

  try {
    // Load the Excel file
    const filePath = path.join(
      __dirname,
      'Data for ICU availability checker.xlsx'
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet data to JSON
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const {
        'Name of the hospital': Name,
        'Address of the hopsital ': Address,
        'Regions': Region,
        'Type of the hospital': Type,
        'Level of the hospital': Level,
        'How many beds are available in all the ICUs ?': ICUbeds,
        'Number of beds currently closed (not functional)': ClosedBeds,
        'General': GeneralBeds,
        'Medical': MedicalBeds,
        'Surgical': SurgicalBeds,
        'Pediatrics': PediatricsBeds,
        'Cardiac': CardiacBeds,
        'Maternal': MaternalBeds,
        'Other ICU': OtherICUBeds,
        'Does the hospital have advanced ambulance services to accept critically ill patients from other hospitals or refer them to other hospitals?':
          AdvancedAmbulanceServices,
        'Survey Timestamp': SurveyTimestamp,
      } = row;

      // Use fuzzy matching for enums
      const mappedRegion = getFuzzyMatch(Region, regionMapping);
      const mappedType = getFuzzyMatch(Type, hospitalTypeMapping);
      const mappedLevel = getFuzzyMatch(Level, hospitalLevelMapping);
      // Parse SurveyTimestamp into a Date object
      // const parsedTimestamp = new Date(SurveyTimestamp);
      // if (isNaN(parsedTimestamp)) {
      //   console.warn(
      //     `Invalid Survey Timestamp, skipping row: ${JSON.stringify(row)}`
      //   );
      //   skippedRows.push(row);
      //   continue;
      // }
      // Skip rows if region mapping fails or required fields are missing
      if (!mappedRegion || !Name || !mappedType || !mappedLevel) {
        console.warn(`Skipping invalid row: `);
        skippedRows.push(row);
        continue;
      }

      // Add to valid rows
      const validRow = {
        name: Name,
        address: Address || 'N/A',
        region: mappedRegion,
        type: mappedType,
        level: mappedLevel,
        icuBeds: parseInt(ICUbeds, 10) || 0,
        availableIcuBeds: parseInt(ICUbeds, 10) || 0,
        nonFunctionalBeds: parseInt(ClosedBeds, 10) || 0,
        bedCapacity:(parseInt(ClosedBeds, 10) || 0) + (parseInt(ICUbeds, 10) || 0),
        general: parseInt(GeneralBeds, 10) || 0,
        medical: parseInt(MedicalBeds, 10) || 0,
        surgical: parseInt(SurgicalBeds, 10) || 0,
        pediatrics: parseInt(PediatricsBeds, 10) || 0,
        cardiac: parseInt(CardiacBeds, 10) || 0,
        maternal: parseInt(MaternalBeds, 10) || 0,
        otherICU: parseInt(OtherICUBeds, 10) || 0,
        advancedAmbulanceServices: AdvancedAmbulanceServices === 'Yes',
      };
      // createdAt: parsedTimestamp,
      // updatedAt: parsedTimestamp,
      try {
        // Create or upsert hospitals in the database
        await prisma.hospital.create({
          data: validRow,
        });
        validRows.push(validRow);
      } catch (error) {
        console.log(error);
        skippedRows.push(row);
      }
    }

    // Write skipped rows to a JSON file if there are any
    if (skippedRows.length > 0) {
      const skippedFilePath = path.join(__dirname, 'skipped_rows.json');
      fs.writeFileSync(skippedFilePath, JSON.stringify(skippedRows, null, 2));
      console.log(`Skipped rows have been saved to ${skippedFilePath}`);
    }

    // Write valid rows to a JSON file
    const validFilePath = path.join(__dirname, 'valid_rows.json');
    fs.writeFileSync(validFilePath, JSON.stringify(validRows, null, 2));
    console.log(`Valid rows have been saved to ${validFilePath}`);

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}



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

// async function updateHospitalCoordinatesFromAdress() {
//   const hospitals = await prisma.hospital.findMany();

//   for (const hospital of hospitals) {
//     const { address } = hospital;
//     const [latitude, longitude] = extractLatLong(address);

//     // Update the hospital record if latitude and longitude are found
//     if (latitude !== null && longitude !== null) {
//       await prisma.hospital.update({
//         where: { id: hospital.id },
//         data: {
//           latitude: latitude,
//           longitude: longitude,
//         },
//       });
//       console.log(
//         `Updated hospital ${hospital.name} with lat: ${latitude}, long: ${longitude}`
//       );
//     }
//   }
// }


const  axios = require('axios');

async function updateHospitalCoordinates() {
  const hospitals = await prisma.hospital.findMany();

  for (const hospital of hospitals) {
      const {name} = hospital;
    try {
      // Fetch coordinates from Google Maps Geocoding API
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: `${name}, Ethiopia`, // Assuming the address includes city/region
          key: '', // Replace with your actual API key
        },
      });

      // Check if the response contains results
      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;

        const latitude = location.lat;
        const longitude = location.lng;

        // Update the hospital record with latitude and longitude
        await prisma.hospital.update({
          where: { id: hospital.id },
          data: {
            address: location.formatted_address,
            latitude: latitude,
            longitude: longitude,
          },
        });
        console.log(
          `Updated hospital ${hospital.name} with lat: ${latitude}, long: ${longitude}`
        );
      } else {
        console.log(`No results found for hospital ${hospital.name}`);
      }
    } catch (error) {
      console.error(`Error fetching coordinates for ${hospital.name}:`, error.message);
    }
  }
}

// dropCollections();
// seedDatabase();

// Execute the function to update coordinates
// updateHospitalCoordinates()
//   .catch((e) => console.error(e))
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
