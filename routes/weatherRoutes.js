const express = require('express');
const router = express.Router();
const Weather = require('../models/weather');
const { fetchAndSaveWeather } = require('../services/weatherService');

// קבלת כל ההיסטוריה
router.get('/history', async (req, res) => {
    try {
        const data = await Weather.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// עדכון ידני
router.get('/update-now', async (req, res) => {
    try {
        const data = await fetchAndSaveWeather();
        res.json({ message: "Updated!", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;