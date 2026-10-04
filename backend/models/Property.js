const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  projectName: { type: String, default: 'Sai Vandan Complex' },
  wing: { type: String, required: true },
  floor: { type: Number, required: true },
  unitNumber: { type: String, required: true, unique: true },
  flatType: { 
    type: String, 
    enum: ['1 BHK', '2 BHK', '3 BHK', '4 BHK'], 
    required: true 
  },
  carpetArea: { type: Number, required: true },
  builtUpArea: { type: Number, required: true },
  price: { type: Number, required: true },
  parking: { type: String, default: 'Covered' },
  amenities: [{ type: String }],
  availability: { 
    type: String, 
    enum: ['Available', 'Reserved', 'Sold'], 
    default: 'Available' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
