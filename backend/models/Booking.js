const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, default: '' },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  unitNumber: { type: String, required: true },
  wing: { type: String, required: true },
  floor: { type: Number, required: true },
  flatType: { type: String, required: true },
  bookingAmount: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  finalPrice: { type: Number, required: true },
  salesExecutive: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Cancelled'], 
    default: 'Confirmed' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
