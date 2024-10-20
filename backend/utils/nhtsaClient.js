const axios = require('axios');
const NHTSA_API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/';
const { createEnrollment } = require('../controllers/enrollmentController');
const MAX_REQUESTS_PER_MINUTE = 5;
let requestQueue = [];
const MAX_REQUEST_INTERVAL = 60000 / MAX_REQUESTS_PER_MINUTE;

exports.rateLimitedDecodeVIN = async function(vin, res) {
    if (!vin) {
        if (res) {
            return res.status(400).json({ message: 'VIN is required' });
        }
        console.error('VIN is required but not provided.');
        return;
    }

    if (requestQueue.length >= MAX_REQUESTS_PER_MINUTE) {
        const oldestRequestTime = requestQueue.shift();
        const waitTime = MAX_REQUEST_INTERVAL - (Date.now() - oldestRequestTime);

        if (waitTime > 0) {
            console.log(`Rate limit reached. Waiting for ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    requestQueue.push(Date.now());
    console.log(`Decoding VIN: ${vin}`);

    try {
        const response = await axios.get(`${NHTSA_API_URL}/${vin}?format=json`);
        const vehicleData = response.data.Results;

        const selectedFields = {
            make: vehicleData.find(field => field.Variable === 'Make')?.Value,
            model: vehicleData.find(field => field.Variable === 'Model')?.Value,
            modelYear: vehicleData.find(field => field.Variable === 'Model Year')?.Value,
            bodyClass: vehicleData.find(field => field.Variable === 'Body Class')?.Value,
            engineCylinders: vehicleData.find(field => field.Variable === 'Engine Number of Cylinders')?.Value,
            fuelType: vehicleData.find(field => field.Variable === 'Fuel Type - Primary')?.Value,
        };

        const req = { body: { vin, decodedDetails: selectedFields } };
        const mockRes = {
            status: (statusCode) => ({
                json: (data) => console.log(`Status ${statusCode}:`, data),
            }),
            json: (data) => console.log('Response:', data),
        };

        await createEnrollment(req, res || mockRes);
        console.log(`Enrollment process completed for VIN: ${vin}`);

    } catch (error) {
        console.error(`Error decoding VIN ${vin}:`, error.message);
        if (res) {
            res.status(500).json({ message: 'Error decoding VIN', error: error.message });
        }
    }
};





