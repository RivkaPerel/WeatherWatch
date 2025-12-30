let myChart = null; // משתנה שיחזיק את הגרף

async function updateWeather() {
    const elements = {
        temp: document.getElementById('temp'),
        desc: document.getElementById('description'),
        city: document.getElementById('city-name'),
        history: document.getElementById('history-container'), 
        icon: document.getElementById('weather-icon'),
        bar: document.getElementById('temp-bar')
    };

    for (const [key, el] of Object.entries(elements)) {
        if (!el) {
            console.error(`Missing HTML element: ID "${key}" not found!`);
            return;
        }
    }

    try {
        const response = await fetch('/api/history');
        const data = await response.json();
        
        if (data && data.length > 0) {
            const latest = data[0];

            // עדכון הנתונים הראשיים
            elements.temp.innerText = `${Math.round(latest.temp)}°C`;
            elements.desc.innerText = latest.description;
            elements.city.innerText = latest.city;
            elements.icon.src = `https://openweathermap.org/img/wn/${latest.icon}@4x.png`;
            
            const percentage = Math.min(Math.max((latest.temp / 40) * 100, 0), 100);
            elements.bar.style.width = percentage + '%';

            // עדכון הגרף (הפוך את הדאטה כדי שיוצג משמאל לימין לפי זמן)
            renderChart([...data].reverse());

            // מילוי היסטוריה
            elements.history.innerHTML = ''; 
            data.forEach(entry => {
                const time = new Date(entry.date).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'});
            const iconCode = entry.icon || '01d'; 
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                const card = `
                    <div class="history-item">
                        <span class="time">${time}</span>
                        <img src="${iconUrl}" alt="icon">
                        <div class="temp">${Math.round(entry.temp)}°C</div>
                        <div class="desc">${entry.description}</div>
                    </div>`;
                elements.history.innerHTML += card;
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// פונקציית הגרף
function renderChart(historyData) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    const labels = historyData.map(d => new Date(d.date).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'}));
    const temps = historyData.map(d => d.temp);

    if (myChart) {
        myChart.destroy(); // משמיד גרף קודם כדי למנוע כפילויות
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'טמפרטורה לאורך זמן',
                data: temps,
                borderColor: '#e67e22', // הצבע הכתום של ה-accent שלך
                backgroundColor: 'rgba(230, 126, 34, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

// פונקציית חיפוש עיר
async function searchCity() {
    const city = document.getElementById('cityInput').value;
    if (!city) return;
    
    const btn = document.querySelector('.search-container button');
    btn.innerText = 'מחפש...';

    try {
        // אנחנו פונים לשרת שלנו שיביא נתון "חי" מה-API
        const response = await fetch(`/api/weather/current?city=${city}`);
        const data = await response.json();
        
        if (data.error) {
            alert("עיר לא נמצאה");
        } else {
            // עדכון התצוגה הראשית עם העיר שחיפשנו
            document.getElementById('city-name').innerText = data.city;
            document.getElementById('temp').innerText = `${Math.round(data.temp)}°C`;
            document.getElementById('description').innerText = data.description;
            document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
        }
    } catch (err) {
        console.error("Search failed", err);
    } finally {
        btn.innerText = 'חפשי';
    }
}

setInterval(updateWeather, 60000);
window.onload = updateWeather;