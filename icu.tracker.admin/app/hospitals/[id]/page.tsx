import { notFound } from "next/navigation";
import { getHospital, getHospitals } from "@/utils/fakeBackend";
import HospitalPage from "./HospitalPage";

export const dynamicParams = true; // Enable dynamic routing

export default async function HospitalPageServer({ params: { id } }: { params: { id: string } }) {
  const hospital = await getHospital(id);

  if (!hospital) {
    notFound();
  }

  return <HospitalPage hospital={hospital} />;
}

// Static generation: define which paths to pre-render
export async function generateStaticParams() {
  const hospitals = await getHospitals(); // Fetch all hospitals to generate paths
  return hospitals.map(hospital => ({
    id: hospital.id.toString(), // Ensure id is a string for the path
  }));
}
