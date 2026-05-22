import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: String,
  time: String,
  doctor: String,
  department: String,
  symptoms: String,

  // ✅ NEW FIELD: STATUS
  status: {
    type: String,
    enum: ['approved', 'pending'],
    default: 'pending',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Appointment', appointmentSchema);