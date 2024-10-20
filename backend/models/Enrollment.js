
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    vin: { type: String, required: true },
    enrollmentID: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
    
});

// Ensure you use module.exports correctly to export the model
module.exports = mongoose.model('Enrollment', enrollmentSchema);
