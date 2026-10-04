const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendorName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  material: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  gstPercent: { type: Number, default: 18 },
  totalAmount: { type: Number, required: true },
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Approved' 
  }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
