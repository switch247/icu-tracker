"use client";
import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Sidebar } from "./components/Sidebar";
import { CheckboxFilter } from "./components/CheckboxFilter";
import { RangeSlider } from "./components/RangeSlider";
import { FilterDropdown } from "./components/FilterDropdown";
import { getHospitals } from "@/utils/fakeBackend";
import { Hospital } from "@/types";
import { HospitalCard } from "@/components/HospitalCard";
import { CreateHospitalDialog } from "./CreateHospital";
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext";

export default function HospitalsPage() {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [bedRange, setBedRange] = useState<[number, number]>([0, 100]);
  const [loading, setLoading] = useState(true);
  const [loadingstate, setLoadingstate] = useState(1);
  useEffect(() => {
    async function fetchHospitals() {
      setLoading(true);
      const interval = setInterval(() => {
        setLoadingstate((prev) => prev + 10);
        if (loadingstate >= 100) {
          clearInterval(interval);
        }
      }, 100);

      const data = await getHospitals( { params :{region: user?.region }});

      const uniqueRegions = Array.from(new Set(data.map((hospital) => hospital.region).filter(Boolean)));
      const uniqueZones = Array.from(new Set(data.map((hospital) => hospital.zone).filter(Boolean)));

      const maxBeds = Math.max(...data.map((hospital) => hospital.icuBeds || 0));
      setBedRange([0, maxBeds]);

      setHospitals(data);
      setFilteredHospitals(data);
      setRegions(uniqueRegions);
      setZones(uniqueZones);
      setLoading(false);
    }
    fetchHospitals();
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("");
    setSelectedZone("");
    setSelectedTypes([]);
    setSelectedLevels([]);
    setBedRange([0, Math.max(...hospitals.map((h) => h.icuBeds || 0))]);
  };

  useEffect(() => {
    const filtered = hospitals.filter((hospital) => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion ? hospital.region === selectedRegion : true;
      const matchesZone = selectedZone ? hospital.zone === selectedZone : true;
      const matchesType = selectedTypes.length ? selectedTypes.includes(hospital.type) : true;
      const matchesLevel = selectedLevels.length ? selectedLevels.includes(hospital.level) : true;
      const matchesBeds =
        hospital.availableIcuBeds >= bedRange[0] && hospital.icuBeds <= bedRange[1];

      return matchesSearch && matchesRegion && matchesZone && matchesType && matchesLevel && matchesBeds;
    });
    setFilteredHospitals(filtered);
  }, [searchQuery, selectedRegion, selectedZone, selectedTypes, selectedLevels, bedRange, hospitals]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center">
        <Progress value={loadingstate} />
      </div>
    );
  }

  return (

    <div className="flex">
      <Sidebar onClearFilters={clearFilters}>
        <Input
          placeholder="Search by hospital name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <br />
        < hr />
        <br />
        <div className="flex justify-evenly">

          <FilterDropdown
            label="Region"
            options={regions}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />
          <FilterDropdown
            label="Zone"
            options={zones}
            value={selectedZone}
            onChange={setSelectedZone}
          />
        </div>
        <br />
        < hr />
        <br />
        <CheckboxFilter
          label="Type"
          options={["PUBLIC", "PRIVATE"]}
          selected={selectedTypes}
          onChange={setSelectedTypes}
        />
        <br />
        < hr />
        <br />
        <CheckboxFilter
          label="Level"
          options={["PRIMARY", "GENERAL", "TERTIARY"]}
          selected={selectedLevels}
          onChange={setSelectedLevels}
        />
        <br />
        < hr />
        <br />
        <RangeSlider
          label="ICU Beds"
          min={0}
          max={bedRange[1]}
          value={bedRange}
          onChange={setBedRange}
        />
      </Sidebar>
      <div className="flex-1 p-4 max-h-svh scroll-m-0 overflow-y-auto">
        <span className="flex justify-between">

          <h1 className="text-3xl font-bold mb-8">Hospitals</h1>
          <CreateHospitalDialog />
        </span>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (
              HospitalCard(hospital)
            ))
          ) : (
            <div>No hospitals found.</div>
          )}
        </div>
      </div>
    </div>

  );
}

