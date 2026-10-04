const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  unitNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  emi: { type: Number, default: 0 },
  applicationDate: { type: Date, default: Date.now },
  sanctionDate: { type: Date },
  remarks: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Loan Applied', 'Bank Verification', 'Approved', 'Rejected', 'Disbursed'], 
    default: 'Loan Applied' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
