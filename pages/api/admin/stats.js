// pages/api/admin/stats.js
import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../lib/mongoose';
import Appointment from '../../../models/Appointment';
import Doctor from '../../../models/Doctor';
const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token || token.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  // Simple aggregation: count by doctor
  const agg = await Appointment.aggregate([
    { $group: { _id: "$doctor", count: { $sum: 1 } } }
  ]);

  // populate doctor names
  const results = [];
  for (const item of agg) {
    const doc = await Doctor.findById(item._id);
    results.push({ doctorName: doc ? doc.name : 'Unknown', count: item.count });
  }

  return res.status(200).json(results);
}
