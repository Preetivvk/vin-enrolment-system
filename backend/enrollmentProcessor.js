require('dotenv').config();

const axios = require('axios');
const mongoose = require('mongoose');
const Enrollment = require('./models/Enrollment');

const ENROLLMENT_INTERVAL = 10000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected for data processing'))
    .catch(err => console.error('MongoDB connection error:', err));

async function enrollmentStatus() {
    try {
        const pendingEnrollments = await Enrollment.find({ status: "inProgress" });
        for (const enrollment of pendingEnrollments) {
            const enrollmentID = enrollment.enrollmentID;

            try {
                const response = await axios.get(`http://localhost:5001/api/enrollments/status/${enrollmentID}`);
                
                const status = response.data.status;
                console.log(`Enrollment ID ${enrollmentID} status: ${status}`);

              
                if (status === 'succeeded') {
                    const existingVehicle = await Vehicle.findOne({ vin: enrollment.vin });

                    if (!existingVehicle) {
                        const newVehicle = new Vehicle({
                            vin: enrollment.vin,
                            ...enrollment.decodedDetails,
                            enrollmentStatus: 'succeeded'
                        });
                        await newVehicle.save();
                        console.log(`Vehicle with VIN ${enrollment.vin} saved to the Vehicle collection.`);
                    } else {
                        console.log(`Vehicle with VIN ${enrollment.vin} already exists in the Vehicle collection.`);
                    }
                }
                    await Enrollment.updateOne({ enrollmentID }, { status: 'succeeded' });
                    console.log(`Enrollment ID ${enrollmentID} marked as succeeded.`);

            } catch (error) {
                console.error(`Error fetching status for enrollment ID ${enrollmentID}:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error during enrollments updation:', error.message);
    }

    setTimeout(enrollmentStatus, ENROLLMENT_INTERVAL);
}

enrollmentStatus();
