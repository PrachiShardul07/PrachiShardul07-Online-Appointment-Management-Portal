// models/Appointment.js
import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

