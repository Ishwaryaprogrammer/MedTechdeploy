// models/medicine.js
const mongoose = require('mongoose');

// Define the Medicine schema
const MedicineSchema = new mongoose.Schema({
  name: String,
  dose: String,
  type: String,
  when: [String],
  frequency: String,
  days: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
});

const Medicine = mongoose.model('Medicine', MedicineSchema);

module.exports = Medicine;
