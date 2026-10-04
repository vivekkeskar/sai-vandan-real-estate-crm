const mongoose = require('mongoose');

const pettyCashSchema = new mongoose.Schema({
  voucherNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { 
    type: String, 
    enum: ['Expense', 'Received'], 
    default: 'Expense' 
  },
  category: { 
    type: String, 
    enum: [
      'Office Expenses', 'Tea & Snacks', 'Fuel', 'Vehicle Maintenance', 
      'Courier', 'Stationery', 'Electricity', 'Internet', 'Marketing', 
      'Site Expenses', 'Labour Payment', 'Miscellaneous', 'Cash Refill'
    ], 
    required: true 
  },
  description: { type: String, required: true },
  employeeName: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'UPI', 'Bank Transfer'], 
    default: 'Cash' 
  },
  approvedBy: { type: String, default: 'Manager' }
}, { timestamps: true });

module.exports = mongoose.model('PettyCash', pettyCashSchema);
