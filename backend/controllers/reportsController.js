const Lead = require('../models/Lead');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Payment = require('../models/Payment');
const SiteVisit = require('../models/SiteVisit');
const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');
const Vendor = require('../models/Vendor');
const VendorBill = require('../models/VendorBill');
const PurchaseOrder = require('../models/PurchaseOrder');
const PettyCash = require('../models/PettyCash');

const getReportByType = async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];

    switch (type) {
      case 'leads':
        data = await Lead.find({}).sort({ createdAt: -1 });
        break;
      case 'sales':
      case 'bookings':
        data = await Booking.find({}).sort({ bookingDate: -1 });
        break;
      case 'properties':
        data = await Property.find({}).sort({ wing: 1, unitNumber: 1 });
        break;
      case 'payments':
        data = await Payment.find({}).sort({ paymentDate: -1 });
        break;
      case 'pending-payments':
        data = await Payment.find({ status: { $in: ['Pending', 'Overdue'] } }).sort({ dueDate: 1 });
        break;
      case 'site-visits':
        data = await SiteVisit.find({}).sort({ visitDate: -1 });
        break;
      case 'employees':
        data = await Employee.find({}).sort({ createdAt: -1 });
        break;
      case 'payroll':
        data = await Payroll.find({}).sort({ createdAt: -1 });
        break;
      case 'vendors':
        data = await Vendor.find({}).sort({ createdAt: -1 });
        break;
      case 'vendor-outstanding':
        data = await VendorBill.find({ balanceAmount: { $gt: 0 } }).sort({ dueDate: 1 });
        break;
      case 'purchases':
        data = await PurchaseOrder.find({}).sort({ date: -1 });
        break;
      case 'petty-cash':
        data = await PettyCash.find({}).sort({ date: -1 });
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type requested' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReportByType };
