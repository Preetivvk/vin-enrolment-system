
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true },
    make: String,
    model: String,
    modelYear: String,
    otherDetails: Object,
    enrollmentStatus: { type: String, default: 'inProgress' }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
