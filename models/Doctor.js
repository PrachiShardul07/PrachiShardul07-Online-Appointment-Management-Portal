// models/Doctor.js
import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  fee: { type: Number, required: true }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
