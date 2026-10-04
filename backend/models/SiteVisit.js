const mongoose = require('mongoose');

const siteVisitSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  visitDate: { type: Date, required: true },
  visitTime: { type: String, default: '11:00 AM' },
  pickupRequired: { type: Boolean, default: false },
  executive: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  propertyUnit: { type: String, default: 'A-101' },
  feedback: { type: String, default: '' },
  remarks: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Visited', 'Rescheduled', 'No Show', 'Cancelled'], 
    default: 'Scheduled' 
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteVisit', siteVisitSchema);
