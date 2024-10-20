const express = require('express');
const { enrollVehicle, getEnrollmentStatus, createEnrollment } = require('../controllers/enrollmentController');
const router = express.Router();

router.post('/enroll', enrollVehicle);
router.get('/status/:enrollmentID', getEnrollmentStatus);
router.post('/enroll', createEnrollment);

module.exports = router;