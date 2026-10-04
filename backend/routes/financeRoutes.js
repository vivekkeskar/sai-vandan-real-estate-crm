const express = require('express');
const router = express.Router();
const { 
  getPayments, createPayment, updatePayment,
  getVendors, createVendor, updateVendor,
  getPurchaseOrders, createPurchaseOrder,
  getVendorBills, createVendorBill,
  getVendorPayments, createVendorPayment,
  getPettyCashEntries, createPettyCashEntry
} = require('../controllers/financeController');
const { protect } = require('../middleware/auth');

router.route('/payments').get(protect, getPayments).post(protect, createPayment);
router.route('/payments/:id').put(protect, updatePayment);

router.route('/vendors').get(protect, getVendors).post(protect, createVendor);
router.route('/vendors/:id').put(protect, updateVendor);

router.route('/purchases').get(protect, getPurchaseOrders).post(protect, createPurchaseOrder);

router.route('/vendor-bills').get(protect, getVendorBills).post(protect, createVendorBill);
router.route('/vendor-payments').get(protect, getVendorPayments).post(protect, createVendorPayment);

router.route('/petty-cash').get(protect, getPettyCashEntries).post(protect, createPettyCashEntry);

module.exports = router;
