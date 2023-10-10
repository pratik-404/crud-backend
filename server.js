const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const cors = require('cors'); // Import the cors package

const app = express();

// Define the PORT constant here
const PORT = process.env.PORT || 3000; // Use the PORT environment variable if available, or default to 3000

console.log("Starting the Employee Management System...");

console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Successfully connected to MongoDB.');
        app.listen(PORT, () => {
            console.log(`Server is now running on port ${PORT}.`);
        });
    })
    .catch(err => {
        console.error('Error occurred while connecting to MongoDB:', err);
    });

console.log("Setting up middlewares and routes...");

// Use the cors middleware to enable CORS support
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRoutes);
console.log("User routes setup.");

app.use('/employees', employeeRoutes);
console.log("Employee routes setup.");

console.log(`Server setup complete. Ready to start on port ${PORT}.`);
