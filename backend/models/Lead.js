const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  city: { type: String, default: 'Pune' },
  budget: { type: Number, required: true },
  interestedProperty: { type: String, default: 'Sai Vandan Complex' },
  configuration: { 
    type: String, 
    enum: ['1 BHK', '2 BHK', '3 BHK', '4 BHK'], 
    required: true 
  },
  source: { 
    type: String, 
    enum: ['Website', 'Facebook', 'Instagram', 'Google Ads', 'WhatsApp', 'Phone Call', 'Walk-in', 'Referral', 'Property Portal'],
    default: 'Website'
  },
  salesExecutive: { type: String, default: 'Unassigned' },
  enquiryDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['New Lead', 'Contacted', 'Qualified', 'Not Interested', 'Future Prospect', 'Wrong Number', 'Duplicate', 'Converted'],
    default: 'New Lead'
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
