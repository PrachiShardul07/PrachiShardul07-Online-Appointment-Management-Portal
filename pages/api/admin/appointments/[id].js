// pages/api/admin/appointments/[id].js
import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../../lib/mongoose';
import Appointment from '../../../../models/Appointment';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });
  if (!token || token.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const del = await Appointment.findByIdAndDelete(id);
      if (!del) return res.status(404).json({ error: 'Appointment not found' });
      return res.status(200).json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
