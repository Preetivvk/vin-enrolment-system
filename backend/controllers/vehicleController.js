
const Vehicle = require('../models/Vehicle');

exports.getVehicleDetails = async (req, res) => {
    const { vin } = req.params;
    try {
        const vehicle = await Vehicle.findOne({ vin });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found or enrollment in progress' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
