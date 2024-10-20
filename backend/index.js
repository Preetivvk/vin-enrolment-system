const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const { pollSFTPServer } = require('./utils/sftpClient');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/vehicles', vehicleRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  pollSFTPServer(); 
});

