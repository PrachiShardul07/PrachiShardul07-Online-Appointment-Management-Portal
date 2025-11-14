// pages/api/booked.js
import dbConnect from '../../lib/mongoose';
import Appointment from '../../models/Appointment';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) return res.status(400).json({ error: 'doctorId and date required' });

    const appts = await Appointment.find({ doctor: doctorId, date });
    const times = appts.map(a => a.time);
    return res.status(200).json(times);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
