const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const weatherRoutes = require('./routes/weatherRoutes');
const { fetchAndSaveWeather } = require('./services/weatherService');
require('dotenv').config();
const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 10000;

const cors = require('cors'); // למעלה עם ה-requires
app.use(cors()); 


// חיבור ל-DB
const mongoURI =process.env.MONGO_URI ;
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Connection Error:', err));

// שימוש בנתיבים
app.use('/api', weatherRoutes);

// אוטומציה - כל שעה
cron.schedule('*/20 * * * *', () => {
    fetchAndSaveWeather();
});


app.get('/api/weather/current', async (req, res) => {
    const city = req.query.city || 'Jerusalem';
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.WEATHER_API_KEY}`
        );
        const data = response.data;
        res.json({
            city: data.name,
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch city data" });
    }
});

app.listen(PORT, () => {
    console.log(` SkyGuard Server ready at http://localhost:${PORT}`);
    // הרצה ראשונית
    fetchAndSaveWeather();
});