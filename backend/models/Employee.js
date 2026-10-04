const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  dateOfJoining: { type: Date, default: Date.now },
  salaryStructure: {
    basic: { type: Number, required: true },
    hra: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    incentives: { type: Number, default: 0 }
  },
  bankDetails: {
    accountNo: { type: String, required: true },
    ifsc: { type: String, required: true },
    bankName: { type: String, required: true }
  },
  pan: { type: String, required: true },
  aadhaar: { type: String, required: true },
  pfNo: { type: String, default: '' },
  esicNo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
