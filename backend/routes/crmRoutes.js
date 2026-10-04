const express = require('express');
const router = express.Router();
const { 
  getFollowUps, createFollowUp, updateFollowUp, deleteFollowUp,
  getProperties, createProperty, updateProperty, deleteProperty,
  getSiteVisits, createSiteVisit, updateSiteVisit,
  getNegotiations, createNegotiation, updateNegotiation,
  getBookings, createBooking, updateBooking,
  getDocuments, createDocument, updateDocument,
  getLoans, createLoan, updateLoan,
  getAgreements, createAgreement, updateAgreement,
  getPossessions, createPossession, updatePossession,
  getSupportTickets, createSupportTicket, updateSupportTicket
} = require('../controllers/crmController');
const { protect } = require('../middleware/auth');

// Follow ups
router.route('/followups').get(protect, getFollowUps).post(protect, createFollowUp);
router.route('/followups/:id').put(protect, updateFollowUp).delete(protect, deleteFollowUp);

// Properties
router.route('/properties').get(protect, getProperties).post(protect, createProperty);
router.route('/properties/:id').put(protect, updateProperty).delete(protect, deleteProperty);

// Site visits
router.route('/site-visits').get(protect, getSiteVisits).post(protect, createSiteVisit);
router.route('/site-visits/:id').put(protect, updateSiteVisit);

// Negotiations
router.route('/negotiations').get(protect, getNegotiations).post(protect, createNegotiation);
router.route('/negotiations/:id').put(protect, updateNegotiation);

// Bookings
router.route('/bookings').get(protect, getBookings).post(protect, createBooking);
router.route('/bookings/:id').put(protect, updateBooking);

// Documents
router.route('/documents').get(protect, getDocuments).post(protect, createDocument);
router.route('/documents/:id').put(protect, updateDocument);

// Loans
router.route('/loans').get(protect, getLoans).post(protect, createLoan);
router.route('/loans/:id').put(protect, updateLoan);

// Agreements
router.route('/agreements').get(protect, getAgreements).post(protect, createAgreement);
router.route('/agreements/:id').put(protect, updateAgreement);

// Possession
router.route('/possession').get(protect, getPossessions).post(protect, createPossession);
router.route('/possession/:id').put(protect, updatePossession);

// Support
router.route('/support').get(protect, getSupportTickets).post(protect, createSupportTicket);
router.route('/support/:id').put(protect, updateSupportTicket);

module.exports = router;
