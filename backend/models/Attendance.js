const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  date: { type: Date, required: true },
  checkIn: { type: String, default: '09:30 AM' },
  checkOut: { type: String, default: '06:30 PM' },
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Half Day', 'Leave'], 
    default: 'Present' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
