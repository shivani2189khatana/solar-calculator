// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and Model for Leads
const leadSchema = new mongoose.Schema({
  phoneNumber: String,
});

// API routes
app.post('/api/calculate', async (req, res) => {
    try {
      const averageBill = req.body.bill;
      const rooftopArea = req.body.area;
      const phoneNumber = req.body.phoneNumber;
      const panelCapicity = 500;//w
      const instalationcost = 6000; // per 1000w
      const mantinancecost = 7200;
      const panelsNeeded = Math.ceil(averageBill / 420);
      const requiredArea = panelsNeeded * 2; // Each panel is 2m x 1m = 2m²
      const capitalNeeded = panelsNeeded * (instalationcost/2); // Rs. 60000 per kW
      const breakevenYears = Math.ceil(capitalNeeded / (averageBill * 12)); // Assuming monthly savings
      const earnings25Years = ((averageBill * 12)-mantinancecost) * 25; // Constant savings per year
      const lead = new Lead({
        phoneNumber,
        panelsNeeded,
        requiredArea,
        capitalNeeded,
        breakevenYears,
        earnings25Years,
      });
  
      await lead.save();
      console.log('Lead saved successfully:', lead); // Logging saved lead for debugging
      res.status(201).json({ lead });
    } catch (err) {
      console.error('Error capturing lead:', err);
      res.status(400).json({ error: err.message || 'Invalid input data' });
    }
  });
module.exports = app;


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
