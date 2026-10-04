const mongoose = require('mongoose');

const vendorBillSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendorName: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: Date, default: Date.now },
  billAmount: { type: Number, required: true },
  gst: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Partially Paid', 'Fully Paid', 'Overdue'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('VendorBill', vendorBillSchema);
