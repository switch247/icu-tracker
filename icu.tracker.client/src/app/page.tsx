"use client"
import dynamic from "next/dynamic";
const EthiopiaHospitalsMap = dynamic(() => import("../../components/EthiopiaHospitalsMap"), { ssr: false });
// import EthiopiaHospitalsMap from "../../components/EthiopiaHospitalsMap";


export default function Home() {
  return (
    <main>
      {/* <h1>ICU Tracker</h1> */}
      <EthiopiaHospitalsMap />
    </main>
  );
}
