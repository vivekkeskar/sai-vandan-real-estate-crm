const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  leaveType: { 
    type: String, 
    enum: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave'], 
    default: 'Casual Leave' 
  },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
