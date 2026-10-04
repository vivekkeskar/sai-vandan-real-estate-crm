const mongoose = require('mongoose');

const leadQualificationSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  budget: { type: Number },
  loanRequired: { type: Boolean, default: false },
  preferredLocation: { type: String, default: 'Sai Vandan Complex, Baner' },
  flatType: { type: String, enum: ['1 BHK', '2 BHK', '3 BHK', '4 BHK'] },
  purchaseTimeline: { type: String, enum: ['Immediate', '1 Month', '3 Months', '6+ Months'], default: '1 Month' },
  purchaseIntent: { type: String, enum: ['Self Use', 'Investment'], default: 'Self Use' },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('LeadQualification', leadQualificationSchema);
