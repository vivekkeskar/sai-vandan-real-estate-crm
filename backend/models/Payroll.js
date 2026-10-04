const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  salaryMonth: { type: String, required: true },
  basic: { type: Number, required: true },
  hra: { type: Number, required: true },
  incentives: { type: Number, default: 0 },
  salesCommission: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  pf: { type: Number, default: 0 },
  esic: { type: Number, default: 0 },
  professionalTax: { type: Number, default: 200 },
  advanceSalary: { type: Number, default: 0 },
  loanRecovery: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },
  grossSalary: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'Bank Transfer', 'UPI', 'Cheque'], 
    default: 'Bank Transfer' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid'], 
    default: 'Paid' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);
