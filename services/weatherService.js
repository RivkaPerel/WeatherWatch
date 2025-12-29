const axios = require('axios');
const Weather = require('..//models/weather');
require('dotenv').config();
const API_KEY = process.env.WEATHER_API_KEY;
const CITY = 'Jerusalem';

async function fetchAndSaveWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        
        const newRecord = new Weather({
            city: response.data.name,
            temp: response.data.main.temp,
            description: response.data.weather[0].description
        });

        await newRecord.save();
        console.log(`[Service] Weather saved: ${response.data.main.temp}°C`);
        return newRecord;
    } catch (error) {
        console.error('Service Error:', error.message);
        throw error;
    }
}

module.exports = { fetchAndSaveWeather };