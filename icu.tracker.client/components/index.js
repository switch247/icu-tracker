"use client"
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./EthiopiaHospitalsMap"), { ssr: false });

export default Map;
