// pages/api/doctors.js
import dbConnect from '../../lib/mongoose';
import Doctor from '../../models/Doctor';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const doctors = await Doctor.find({});

    if (doctors.length === 0) {
      // Seed doctors on first run
      const seed = [
        { name: 'Dr. Asha Mehra', specialization: 'General Physician', fee: 300 },
        { name: 'Dr. Rohit Verma', specialization: 'Dermatologist', fee: 500 },
        { name: 'Dr. Sangeeta Rao', specialization: 'Pediatrician', fee: 400 },
        { name: 'Dr. Kavita Sharma', specialization: 'Cardiologist', fee: 800 },
        { name: 'Dr. Manoj Patil', specialization: 'Neurologist', fee: 900 },
        { name: 'Dr. Anjali Deshmukh', specialization: 'Orthopedic', fee: 700 },
        { name: 'Dr. Rishi Agarwal', specialization: 'Dentist', fee: 500 },
        { name: 'Dr. Neha Bansal', specialization: 'Gynecologist', fee: 650 },
        { name: 'Dr. Pragati Kulkarni', specialization: 'ENT Specialist', fee: 550 }
      ];

      await Doctor.create(seed);
      return res.status(200).json(seed);
    }

    return res.status(200).json(doctors);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

