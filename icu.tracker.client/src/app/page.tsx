
"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// const EthiopiaHospitalsMap = dynamic(() => import("../../components/EthiopiaHospitalsMap"), { ssr: false });

const LazyMap = dynamic(() => import("../../components/EthiopiaHospitalsMap"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  // const EthiopiaHospitalsMap = useMemo(() => dynamic(
  //   () => import('../../components/EthiopiaHospitalsMap'),
  //   {
  //     loading: () => <p>A map is loading</p>,
  //     ssr: false
  //   }
  // ), [])
  return (
    <main>
      {/* <h1>ICU Tracker</h1> */}
      <LazyMap />
    </main>
  );
}
