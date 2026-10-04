const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  customerName: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  unitNumber: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  offeredPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  specialOffer: { type: String, default: '' },
  finalPrice: { type: Number, required: true },
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Negotiation', negotiationSchema);
