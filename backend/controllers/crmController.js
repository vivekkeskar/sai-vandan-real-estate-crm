const FollowUp = require('../models/FollowUp');
const Property = require('../models/Property');
const SiteVisit = require('../models/SiteVisit');
const Negotiation = require('../models/Negotiation');
const Booking = require('../models/Booking');
const Document = require('../models/Document');
const Loan = require('../models/Loan');
const Agreement = require('../models/Agreement');
const Possession = require('../models/Possession');
const SupportTicket = require('../models/SupportTicket');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');

// ================= FOLLOW UP CONTROLLER =================
const getFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find({}).populate('leadId', 'name mobile email configuration').sort({ date: -1 });
    res.json(followUps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.create(req.body);
    // Create notification if follow-up is created
    await Notification.create({
      title: 'New Follow-up Scheduled',
      message: `Follow-up for lead with executive ${followUp.executiveName} on ${new Date(followUp.date).toLocaleDateString()}`,
      type: 'FollowUp'
    });
    res.status(201).json(followUp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFollowUp = async (req, res) => {
  try {
    const item = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFollowUp = async (req, res) => {
  try {
    await FollowUp.findByIdAndDelete(req.params.id);
    res.json({ message: 'Follow up deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PROPERTY CONTROLLER =================
const getProperties = async (req, res) => {
  try {
    const { wing, flatType, availability, search } = req.query;
    let query = {};

    if (wing && wing !== 'All') query.wing = wing;
    if (flatType && flatType !== 'All') query.flatType = flatType;
    if (availability && availability !== 'All') query.availability = availability;
    if (search) query.unitNumber = { $regex: search, $options: 'i' };

    const properties = await Property.find(query).sort({ wing: 1, floor: 1, unitNumber: 1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const item = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SITE VISIT CONTROLLER =================
const getSiteVisits = async (req, res) => {
  try {
    const visits = await SiteVisit.find({}).sort({ visitDate: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSiteVisit = async (req, res) => {
  try {
    const visit = await SiteVisit.create(req.body);
    await Notification.create({
      title: 'Site Visit Scheduled',
      message: `Site visit for customer ${visit.customerName} on ${new Date(visit.visitDate).toLocaleDateString()}`,
      type: 'SiteVisit'
    });
    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSiteVisit = async (req, res) => {
  try {
    const visit = await SiteVisit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= NEGOTIATION CONTROLLER =================
const getNegotiations = async (req, res) => {
  try {
    const items = await Negotiation.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNegotiation = async (req, res) => {
  try {
    const item = await Negotiation.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNegotiation = async (req, res) => {
  try {
    const item = await Negotiation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= BOOKING CONTROLLER =================
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('propertyId').sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    // Business Logic: Automatically change Property Status to SOLD / RESERVED
    if (booking.propertyId) {
      await Property.findByIdAndUpdate(booking.propertyId, { 
        availability: booking.status === 'Confirmed' ? 'Sold' : 'Reserved' 
      });
    }

    // Also update lead status if associated
    if (req.body.mobile) {
      await Lead.findOneAndUpdate({ mobile: req.body.mobile }, { status: 'Converted' });
    }

    await Notification.create({
      title: 'New Property Booking Confirmed!',
      message: `Unit ${booking.unitNumber} booked by ${booking.customerName} for ₹${(booking.finalPrice / 100000).toFixed(2)} Lakhs`,
      type: 'Payment'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (booking.propertyId && req.body.status) {
      const propertyStatus = req.body.status === 'Confirmed' ? 'Sold' : (req.body.status === 'Cancelled' ? 'Available' : 'Reserved');
      await Property.findByIdAndUpdate(booking.propertyId, { availability: propertyStatus });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DOCUMENT CONTROLLER =================
const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({}).populate('bookingId').sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    const doc = await Document.create(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOAN CONTROLLER =================
const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({}).sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLoan = async (req, res) => {
  try {
    const loan = await Loan.create(req.body);
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= AGREEMENT CONTROLLER =================
const getAgreements = async (req, res) => {
  try {
    const items = await Agreement.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAgreement = async (req, res) => {
  try {
    const item = await Agreement.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAgreement = async (req, res) => {
  try {
    const item = await Agreement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= POSSESSION CONTROLLER =================
const getPossessions = async (req, res) => {
  try {
    const items = await Possession.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPossession = async (req, res) => {
  try {
    const item = await Possession.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePossession = async (req, res) => {
  try {
    const item = await Possession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SUPPORT CONTROLLER =================
const getSupportTickets = async (req, res) => {
  try {
    const items = await SupportTicket.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSupportTicket = async (req, res) => {
  try {
    const item = await SupportTicket.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSupportTicket = async (req, res) => {
  try {
    const item = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
