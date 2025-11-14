import { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import Navbar from "../components/Navbar";

export default function Home() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto mt-10 px-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Available Doctors
        </h2>
        <p className="text-gray-600 mt-1 mb-6">
          Choose a doctor and schedule an appointment.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length === 0 ? (
            <p>Loading...</p>
          ) : (
            doctors.map((d) => <DoctorCard key={d._id} doctor={d} />)
          )}
        </div>
      </main>
    </>
  );
}
