const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  unitNumber: { type: String, required: true },
  paymentType: { 
    type: String, 
    enum: ['Booking Amount', 'Agreement Payment', 'Slab Payment', 'Final Payment'], 
    required: true 
  },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'Bank Transfer', 'UPI', 'Cheque'], 
    default: 'Bank Transfer' 
  },
  transactionNumber: { type: String, default: '' },
  remarks: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Overdue'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
