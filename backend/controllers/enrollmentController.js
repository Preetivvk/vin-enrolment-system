const Vehicle = require('../models/Vehicle');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');

exports.createEnrollment = async (req, res) => {
    const { vin, decodedDetails } = req.body;

    try {
        const enrollmentID = new mongoose.Types.ObjectId();
        const newEnrollment = new Enrollment({
            vin,
            enrollmentID,
            decodedDetails,
            status: 'inProgress',
            createdAt: new Date(),
        });

        await newEnrollment.save();
        console.log('Enrollment created with ID:', enrollmentID);

        res.status(201).json({ message: 'Enrollment created', enrollmentID });
    } catch (error) {
        console.error('Error creating enrollment:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.enrollVehicle = async (req, res) => {
    const { vin, decodedDetails } = req.body;

    try {
        const existingVehicle = await Vehicle.findOne({ vin });
        if (existingVehicle) {
            console.log(`Vehicle with VIN ${vin} already exists`);
            return res.status(400).json({ message: 'VIN already in progress or enrolled' });
        }

        const newVehicle = new Vehicle({
            vin,
            ...decodedDetails,
            enrollmentStatus: 'inProgress',
        });
        await newVehicle.save();
        console.log('Vehicle saved to database:', newVehicle);

        const enrollmentID = new mongoose.Types.ObjectId();
        const newEnrollment = new Enrollment({
            vin,
            enrollmentID,
            createdAt: new Date(),
        });
        await newEnrollment.save();
        console.log('Enrollment saved with ID:', enrollmentID);

        res.status(202).json({ enrollmentID });
    } catch (error) {
        console.error('Error during vehicle enrollment:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.getEnrollmentStatus = async (req, res) => {
    const { enrollmentID } = req.params;
    try {
        const enrollment = await Enrollment.findOne({ enrollmentID });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        const olderInProgressEnrollment = await Enrollment.findOne({
            createdAt: { $lt: enrollment.createdAt },
            status: 'inProgress'
        });

        if (olderInProgressEnrollment) {
            return res.json({ status: 'inProgress' });
        }

        const timeDifference = new Date() - new Date(enrollment.createdAt);
        const timeLimit = 120000; 

        if (timeDifference < timeLimit) {
            return res.json({ status: 'inProgress' });
        }
        res.json({ status: 'succeeded' });
        console.log(`Enrollment ID ${enrollmentID} marked as succeeded.`);
    } catch (error) {
        console.error('Error fetching enrollment status:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
