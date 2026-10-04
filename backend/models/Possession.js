const mongoose = require('mongoose');

const possessionSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  unitNumber: { type: String, required: true },
  finalInspection: { type: Boolean, default: false },
  utilityConnection: { type: Boolean, default: false },
  keyHandover: { type: Boolean, default: false },
  possessionLetter: { type: Boolean, default: false },
  possessionDate: { type: Date },
  remarks: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Ready', 'Delivered'], 
    default: 'Ready' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Possession', possessionSchema);
