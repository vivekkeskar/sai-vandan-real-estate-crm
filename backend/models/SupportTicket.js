const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  unitNumber: { type: String, required: true },
  requestType: { 
    type: String, 
    enum: ['Maintenance', 'Complaint', 'Service Request', 'Documentation', 'Referral'], 
    required: true 
  },
  description: { type: String, required: true },
  assignedEmployee: { type: String, default: 'Unassigned' },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Urgent'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'], 
    default: 'Open' 
  },
  createdDate: { type: Date, default: Date.now },
  resolvedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
