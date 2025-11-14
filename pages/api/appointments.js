// pages/api/appointments.js
import dbConnect from '../../lib/mongoose';
import Appointment from '../../models/Appointment';
import Doctor from '../../models/Doctor';
import { sendEmail } from '../../lib/email';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { patientName, doctorId, date, time, email } = req.body;

    if (!patientName || !doctorId || !date || !time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // validate doctor exists
    const doc = await Doctor.findById(doctorId);
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });

    // conflict check
    const conflict = await Appointment.findOne({ doctor: doctorId, date, time });
    if (conflict) return res.status(409).json({ error: 'Slot already booked' });

    const appt = await Appointment.create({
      patientName,
      doctor: doctorId,
      date,
      time,
      email: email || null
    });

    // send email (non-blocking: await to ensure send attempted)
    try {
      if (email) {
        await sendEmail({
          to: email,
          subject: `Appointment confirmation with ${doc.name}`,
          text: `Hi ${patientName},\n\nYour appointment with ${doc.name} is confirmed for ${date} at ${time}.\n\nThanks.`,
          html: `<p>Hi ${patientName},</p><p>Your appointment with <strong>${doc.name}</strong> is confirmed for <strong>${date}</strong> at <strong>${time}</strong>.</p>`
        });
      }
    } catch (err) {
      console.error('Email send failed', err);
      // do not fail the booking because of email
    }

    return res.status(201).json({ message: 'Appointment created', appointment: appt });
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
