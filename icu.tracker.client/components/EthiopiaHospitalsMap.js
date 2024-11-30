'use client';

import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polygon,
  GeoJSON,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import regionsGeoJson from './regionsGeoJson.json';
import zonesGeoJson from './zonesGeoJson.json';
import regionToZone from './region_to_zone.json';
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

const regionColors = {
  'Addis Ababa': '#FF5733',
  'Tigray': '#33FF57',
  'Somali': '#3357FF',
  'Dire Dawa': '#FF33A1',
  'Hareri': '#FF8C33',
  'SNNPR': '#33FFF5',
  'Gambela': '#8C33FF',
  'Benishangul-Gumuz': '#FF33D4',
  'Amhara': '#33FF8C',
  'Afar': '#FF3333',
  'Oromia': '#33D4FF',
};

const regionStyle = (feature) => {
  return {
    fillColor: regionColors[feature.properties.REGIONNAME] || '#FFFFFF',
    weight: 2,
    opacity: 1,
    color: 'black',
    fillOpacity: 0.7,
  };
};
const EthiopiaHospitalsMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [zoneGeoJsonData, setZoneGeoJsonData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        // Get the region name from the clicked feature
        var regionName = feature.properties.REGIONNAME;
        if (regionName== "Beneshangul Gumu"){
            regionName = "Benishangul-Gumuz"
        }
        // Get the zones that belong to the selected region
        const zonesInRegion = regionToZone.zones
          .filter((zone) => zone.region === regionName)
          .map((zone) => zone.zone);

        // Filter the zonesGeoJson data based on the zones in the selected region
        const filteredZones = zonesGeoJson.features.filter((zone) =>
          zonesInRegion.includes(zone.properties.ZONENAME)
        );

         // Clear the state before setting it again to force re-render
         setZoneGeoJsonData(null);
         setTimeout(() => {
           setZoneGeoJsonData({
             type: 'FeatureCollection',
             features: filteredZones,
           });
         }, 0);
 
         setSelectedRegion(regionName);
         console.log('filteredZones:', filteredZones);

      },
    });
    // Bind Tooltip to each region
    layer.bindTooltip(feature.properties.REGIONNAME, {
      permanent: true,
      direction: 'top',
      offset:
        feature.properties.REGIONNAME == 'Addis Ababa' ? [0, 20] : [0, -20],
      className: 'region-tooltip',
    });

    // Bind Popup to each region
    layer.bindPopup(
      `<div>
          <strong>${feature.properties.REGIONNAME}</strong>
          <br />
          <strong>Area:</strong> ${feature.properties.AREA} km²
          <br />
          <strong>Population:</strong> ${feature.properties.POPULATION}
        </div>`
    );
  };
  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      // Load your GeoJSON data here
      setGeoJsonData(regionsGeoJson);
      //   setZoneGeoJsonData(zonesGeoJson);
    }
  }, []);

  // Fetch hospitals data from the backend API
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/hospitals`
        );
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
  // Ensure the map is only rendered on the client side
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {leftSideHospitals(filteredHospitals)}

      <div
        style={{
          flex: 8,
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        {/* Search Bar */}
        {SearchBar(searchQuery, handleSearch)}

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
            zoom={6.2}
            minZoom={6}
            maxZoom={15}
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
            {/* Render GeoJSON for regions */}
            {geoJsonData && (
              <GeoJSON
                data={geoJsonData}
                style={regionStyle}
                onEachFeature={onEachFeature}
              >
                {selectedRegion && (
                  <Tooltip direction="top" offset={[0, -20]} permanent>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {selectedRegion.REGIONNAME}
                    </span>
                  </Tooltip>
                )}
              </GeoJSON>
            )}
            {zoneGeoJsonData && (
              <GeoJSON
                data={zoneGeoJsonData}
                style={{
                  fillColor: '#FF5733',
                  weight: 1,
                  opacity: 1,
                  color: 'blue',
                  fillOpacity: 0.5,
                }}
              />
            )}
          </MapContainer>
        )}

        {/* Legend Footer */}
        {LegendFooter()}
      </div>
    </div>
  );
};

export default EthiopiaHospitalsMap;

function LegendFooter() {
  return (
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
  );
}

function SearchBar(searchQuery, handleSearch) {
  return (
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
  );
}

function leftSideHospitals(filteredHospitals) {
  return (
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
  );
}
