import Link from "next/link";

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
      <p className="text-gray-600 mt-1">{doctor.specialization}</p>
      <p className="text-gray-900 font-medium mt-2">Fee: ₹{doctor.fee}</p>
      <Link
        href={`/book/${doctor._id}`}
        className="inline-block mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Book Appointment
      </Link>
    </div>
  );
}
