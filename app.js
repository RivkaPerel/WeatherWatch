const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const weatherRoutes = require('./routes/weatherRoutes');
const { fetchAndSaveWeather } = require('./services/weatherService');
require('dotenv').config();
const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

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
cron.schedule('* * * * *', () => {
    fetchAndSaveWeather();
});

app.listen(PORT, () => {
    console.log(` SkyGuard Server ready at http://localhost:${PORT}`);
    // הרצה ראשונית
    fetchAndSaveWeather();
});