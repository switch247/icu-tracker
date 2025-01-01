import React from 'react';

function HospitalCard({ hospital }) {
    return (
        <div className="max-w-sm mx-auto my-2 p-3 border border-gray-300 rounded-lg bg-white shadow-md transition-transform transform hover:scale-105 overflow-hidden">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{hospital.name}</h3>

            {/* Region, Type, and Level in the same row */}
            <div className="flex justify-between border rounded-md shadow-sm mb-2">
                <div className="flex flex-col p-1  bg-gray-50 w-1/3">
                    <span className="font-semibold text-gray-600">Region:</span>
                    <span className="text-gray-800 text-sm">{hospital.region}</span>
                </div>
                <div className="flex flex-col p-1  bg-gray-50 w-1/3">
                    <span className="font-semibold text-gray-600">Type:</span>
                    <span className="text-gray-800 text-sm">{getHospitalType(hospital.type)}</span>
                </div>
                <div className="flex flex-col p-1  bg-gray-50 w-1/3">
                    <span className="font-semibold text-gray-600">Level:</span>
                    <span className="text-gray-800 text-sm">{hospital.level}</span>
                </div>
            </div>

            {/* ICU Information Row */}
            <div className="flex justify-between items-center p-1 border rounded-md shadow-sm bg-gray-50 mb-2">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-600 text-sm">Total ICUs:</span>
                    <span className={`text-gray-800 text-sm ${hospital.icuBeds <= 0 ? 'text-red-500' : ''}`}>{hospital.icuBeds}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-600 text-sm">Available ICUs:</span>
                    <span className={`text-gray-800 text-sm ${hospital.availableIcuBeds <= 0 ? 'text-red-500' : ''}`}>{hospital.availableIcuBeds}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-600 text-sm">Non-Functional:</span>
                    <span className={`text-gray-800 text-sm ${hospital.nonFunctionalBeds <= 0 ? 'text-red-500' : ''}`}>{hospital.nonFunctionalBeds}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-1 mb-2">
                {renderICUInfo(hospital)}
            </div>

            <div className="flex justify-between items-center p-1 border rounded-md shadow-sm bg-gray-50">
                <div>
                    <span className="font-semibold text-gray-600 text-sm">Ambulance Services:</span>
                    <span className="text-gray-800 text-sm">{hospital.advancedAmbulanceServices ? 'Yes' : 'No'}</span>
                </div>
                <div>
                    <span className="font-semibold text-gray-600 text-sm">Last Updated:</span>
                    <span className="text-gray-800 text-sm">{new Date(hospital.updatedAt).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

function renderICUInfo(hospital) {
    const icuData = [
        { label: 'General', value: hospital.general },
        { label: 'Medical', value: hospital.medical },
        { label: 'Surgical', value: hospital.surgical },
        { label: 'Pediatrics', value: hospital.pediatrics },
        { label: 'Cardiac', value: hospital.cardiac },
        { label: 'Maternal', value: hospital.maternal },
        { label: 'Other ICU', value: hospital.otherICU },
    ];

    return icuData.map((item) => (
        <div key={item.label} className="border p-1 rounded-md shadow-sm bg-gray-50 text-sm">
            <span className="font-semibold text-gray-600">{item.label}:</span>
            <span className={`text-gray-800 ${item.value <= 0 ? 'text-red-500' : ''}`}> {item.value}</span>
        </div>
    ));
}

// Helper function to get hospital type
function getHospitalType(type) {
    switch (type) {
        case 'PRIVATE':
            return 'Private';
        case 'GOVERNMENT':
            return 'Government';
        default:
            return 'NGO';
    }
}

export default HospitalCard;