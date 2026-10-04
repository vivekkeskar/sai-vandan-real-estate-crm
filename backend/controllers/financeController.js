const Payment = require('../models/Payment');
const Vendor = require('../models/Vendor');
const PurchaseOrder = require('../models/PurchaseOrder');
const VendorBill = require('../models/VendorBill');
const VendorPayment = require('../models/VendorPayment');
const PettyCash = require('../models/PettyCash');
const Notification = require('../models/Notification');
const Booking = require('../models/Booking');

// ================= CUSTOMER PAYMENTS CONTROLLER =================
const getPayments = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { unitNumber: { $regex: search, $options: 'i' } },
        { transactionNumber: { $regex: search, $options: 'i' } }
      ];
    }
    const payments = await Payment.find(query).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    
    // Create notification if paid
    if (payment.status === 'Paid') {
      await Notification.create({
        title: 'Customer Payment Received',
        message: `₹${payment.amount.toLocaleString()} received from ${payment.customerName} for Unit ${payment.unitNumber} (${payment.paymentType})`,
        type: 'Payment'
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VENDOR CONTROLLER =================
const getVendors = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { vendorName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ];
    }
    const vendors = await Vendor.find(query).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PURCHASE ORDERS CONTROLLER =================
const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find({}).populate('vendorId').sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPurchaseOrder = async (req, res) => {
  try {
    const { poNumber, vendorId, vendorName, material, quantity, rate, gstPercent } = req.body;
    const qty = Number(quantity) || 1;
    const r = Number(rate) || 0;
    const gst = Number(gstPercent) || 18;
    const base = qty * r;
    const totalAmount = base + (base * (gst / 100));

    const po = await PurchaseOrder.create({
      poNumber: poNumber || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorId,
      vendorName,
      material,
      quantity: qty,
      rate: r,
      gstPercent: gst,
      totalAmount,
      approvalStatus: req.body.approvalStatus || 'Approved'
    });

    res.status(201).json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VENDOR BILLS & PAYMENTS CONTROLLER =================
const getVendorBills = async (req, res) => {
  try {
    const bills = await VendorBill.find({}).populate('vendorId').sort({ invoiceDate: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVendorBill = async (req, res) => {
  try {
    const { vendorId, vendorName, invoiceNumber, invoiceDate, billAmount, gst, dueDate } = req.body;
    const amount = Number(billAmount) || 0;
    const gstAmt = Number(gst) || 0;
    const totalBill = amount + gstAmt;

    const bill = await VendorBill.create({
      vendorId,
      vendorName,
      invoiceNumber,
      invoiceDate: invoiceDate || Date.now(),
      billAmount: totalBill,
      gst: gstAmt,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paidAmount: 0,
      balanceAmount: totalBill,
      status: 'Pending'
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVendorPayment = async (req, res) => {
  try {
    const { billId, vendorId, vendorName, paymentDate, paymentMode, transactionNumber, bank, paidAmount } = req.body;
    const payAmt = Number(paidAmount) || 0;

    const payment = await VendorPayment.create({
      billId, vendorId, vendorName, paymentDate: paymentDate || Date.now(), paymentMode, transactionNumber, bank, paidAmount: payAmt
    });

    if (billId) {
      const bill = await VendorBill.findById(billId);
      if (bill) {
        bill.paidAmount += payAmt;
        bill.balanceAmount = Math.max(0, bill.billAmount - bill.paidAmount);
        bill.status = bill.balanceAmount === 0 ? 'Fully Paid' : 'Partially Paid';
        await bill.save();
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorPayments = async (req, res) => {
  try {
    const payments = await VendorPayment.find({}).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PETTY CASH CONTROLLER =================
const getPettyCashEntries = async (req, res) => {
  try {
    const entries = await PettyCash.find({}).sort({ date: -1 });
    
    // Auto calculate balance
    let totalReceived = 0;
    let totalSpent = 0;

    entries.forEach(entry => {
      if (entry.type === 'Received') totalReceived += entry.amount;
      else totalSpent += entry.amount;
    });

    const closingBalance = totalReceived - totalSpent;

    res.json({
      entries,
      summary: {
        openingBalance: 50000,
        totalReceived,
        totalSpent,
        closingBalance: 50000 + closingBalance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPettyCashEntry = async (req, res) => {
  try {
    const count = await PettyCash.countDocuments();
    const voucherNumber = req.body.voucherNumber || `PCV-${String(count + 1).padStart(4, '0')}`;
    
    const entry = await PettyCash.create({
      ...req.body,
      voucherNumber
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments, createPayment, updatePayment,
  getVendors, createVendor, updateVendor,
  getPurchaseOrders, createPurchaseOrder,
  getVendorBills, createVendorBill,
  getVendorPayments, createVendorPayment,
  getPettyCashEntries, createPettyCashEntry
};
