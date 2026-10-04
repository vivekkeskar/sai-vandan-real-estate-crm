const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  companyName: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Civil Contractor', 'Electrical Contractor', 'Plumbing Contractor', 
      'Paint Contractor', 'Material Supplier', 'Lift Supplier', 
      'Security Agency', 'Housekeeping', 'Architect', 'Interior Designer', 'Legal Consultant'
    ], 
    required: true 
  },
  gstNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  contactPerson: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  bankDetails: {
    accountNo: { type: String, default: '' },
    ifsc: { type: String, default: '' },
    bankName: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
