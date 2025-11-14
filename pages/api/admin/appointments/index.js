// pages/api/admin/appointments/index.js
import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import Appointment from '../../../../models/Appointment';
import Doctor from '../../../../models/Doctor';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token || token.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    // Return appointments, populated with doctor
    const appts = await Appointment.find({}).sort({ date: 1, time: 1 }).populate('doctor');
    return res.status(200).json(appts);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
