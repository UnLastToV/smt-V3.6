require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const authRoutes = require('./server/routes/authRoutes');
const loginRoutes = require('./server/routes/Login.route');
const ticketRoutes = require("./server/routes/ticket.routes");
const citizenRoutes = require('./server/routes/Citizen.route');

const app = express();

// Middleware for parsing JSON data
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/', loginRoutes);
app.use("/api", ticketRoutes);
app.use('/citizens', citizenRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('[-- MongoDB connected --]'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
