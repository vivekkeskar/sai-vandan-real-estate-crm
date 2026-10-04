const mongoose = require('mongoose');

const vendorPaymentSchema = new mongoose.Schema({
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorBill' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendorName: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'Bank Transfer', 'UPI', 'Cheque'], 
    default: 'Bank Transfer' 
  },
  transactionNumber: { type: String, default: '' },
  bank: { type: String, default: 'HDFC Bank' },
  paidAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('VendorPayment', vendorPaymentSchema);
