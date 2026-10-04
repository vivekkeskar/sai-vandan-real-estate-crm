const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  type: { 
    type: String, 
    enum: ['Phone Call', 'WhatsApp', 'Email', 'SMS', 'Meeting', 'Video Call'], 
    default: 'Phone Call' 
  },
  date: { type: Date, default: Date.now },
  time: { type: String, default: '10:00 AM' },
  remarks: { type: String, required: true },
  nextFollowUpDate: { type: Date },
  executiveName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Rescheduled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
