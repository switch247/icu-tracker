'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom hospital icon (House-like, properly styled)
const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046869.png', // Icon URL
  iconSize: [50, 50], // Marker size
  iconAnchor: [25, 50], // Anchor to center-bottom
  popupAnchor: [0, -50], // Popup offset
  shadowUrl: null, // No shadow
  shadowSize: null,
  shadowAnchor: null,
});

const EthiopiaHospitalsMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Fetch hospitals data from the backend API
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hospitals`);
        console.log(response, 'response');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHospitals(data.data || []);
        setFilteredHospitals(data.data || []);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setError(error.message);
      }
    };

    fetchHospitals();
  }, []);

  // Handle search input changes
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter hospitals based on the search query
    const filtered = hospitals.filter((hospital) =>
      hospital.name.toLowerCase().includes(query)
    );
    setFilteredHospitals(filtered);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 2, overflowY: 'auto', padding: '10px' }}>
        <span>
          <strong>Showing {filteredHospitals.length} hospitals</strong>
        </span>
        {filteredHospitals.map((hospital) => (
          <div
            key={hospital.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>{hospital.name}</h3>
            <p style={{ margin: '0' }}>
              <strong>Type:</strong>{' '}
              {hospital.type === 'PRIVATE'
                ? 'Private'
                : hospital.type === 'GOVERNMENT'
                ? 'Government'
                : 'NGO'}
            </p>
            <p style={{ margin: '0' }}>
              <strong>Total ICUs:</strong> {hospital.icuBeds}
            </p>
            <p style={{ margin: '0' }}>
              <strong>Bed Capacity:</strong> {hospital.bedCapacity}
            </p>
            <p style={{ margin: '0' }}>
              <strong>Last Updated:</strong>{' '}
              {new Date(hospital.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div
        style={{
          flex: 8,
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '80%',
            maxWidth: '400px',
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search hospitals by name..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
            }}
          />
        </div>

        {error ? (
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'red',
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <MapContainer
            center={[9.03, 38.74]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render markers */}
            {filteredHospitals.map(
              (hospital) =>
                hospital.latitude &&
                hospital.longitude && (
                  <Marker
                    key={hospital.id}
                    position={[hospital.latitude, hospital.longitude]}
                    icon={hospitalIcon}
                  >
                    {/* Tooltip for displaying hospital name */}
                    <Tooltip direction="top" offset={[0, -50]} permanent>
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {hospital.name}
                      </span>
                    </Tooltip>

                    <Popup>
                      <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                        <strong
                          style={{
                            color: '#c33',
                            fontSize: '16px',
                          }}
                        >
                          {hospital.name}
                        </strong>
                        <br />
                        <strong>Type:</strong>{' '}
                        {hospital.type === 'PRIVATE'
                          ? 'Private'
                          : hospital.type === 'GOVERNMENT'
                          ? 'Government'
                          : 'NGO'}
                        <br />
                        <strong>Total ICUs:</strong> {hospital.icuBeds}
                        <br />
                        <strong>Bed Capacity:</strong> {hospital.bedCapacity}
                        <br />
                        <strong>Last Updated:</strong>{' '}
                        {new Date(hospital.updatedAt).toLocaleString()}
                      </div>
                    </Popup>
                  </Marker>
                )
            )}
          </MapContainer>
        )}

        {/* Legend Footer */}
        <div
          style={{
            zIndex: 1000,
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '14px',
          }}
        >
          <strong>Legend:</strong> P = Private, G = Government, NG = NGO
        </div>
      </div>
    </div>
  );
};

export default EthiopiaHospitalsMap;
