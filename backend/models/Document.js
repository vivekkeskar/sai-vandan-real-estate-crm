const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  unitNumber: { type: String, required: true },
  documents: [{
    docType: { 
      type: String, 
      enum: ['PAN Card', 'Aadhaar Card', 'Passport Photo', 'Address Proof', 'Income Proof', 'Bank Statement'],
      required: true
    },
    fileName: { type: String, default: 'document.pdf' },
    uploadDate: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['Pending', 'Submitted', 'Verified', 'Rejected'], 
      default: 'Pending' 
    },
    remarks: { type: String, default: '' }
  }],
  overallStatus: { 
    type: String, 
    enum: ['Pending', 'Submitted', 'Verified', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
