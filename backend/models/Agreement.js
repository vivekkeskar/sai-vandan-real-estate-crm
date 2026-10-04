const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  unitNumber: { type: String, required: true },
  agreementDate: { type: Date, default: Date.now },
  agreementAmount: { type: Number, required: true },
  stampDuty: { type: Number, required: true },
  registrationDate: { type: Date },
  registrationNumber: { type: String, default: '' },
  remarks: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Agreement Completed', 'Registered'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Agreement', agreementSchema);
