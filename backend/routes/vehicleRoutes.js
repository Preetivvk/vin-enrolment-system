
const express = require('express');
const { getVehicleDetails } = require('../controllers/vehicleController');
const router = express.Router();

router.get('/:vin', getVehicleDetails);

module.exports = router;
