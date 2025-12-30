async function updateWeather() {
    // הגדרת האלמנטים
    const elements = {
        temp: document.getElementById('temp'),
        desc: document.getElementById('description'),
        city: document.getElementById('city-name'),
        history: document.getElementById('history-container'), 
        icon: document.getElementById('weather-icon')|| '01d',
        bar: document.getElementById('temp-bar')
    };

    // בדיקה מהירה - אם משהו חסר, הוא ידפיס אזהרה במקום לקרוס
    for (const [key, el] of Object.entries(elements)) {
        if (!el) {
            console.error(`Missing HTML element: ID "${key}" not found!`);
            return; // עוצר את הפונקציה לפני שהיא קורסת
        }
    }

    try {
        const response = await fetch('/api/history');
        const data = await response.json();
console.log("מה שהגיע מהשרת:", data);
        if (data && data.length > 0) {
            const latest = data[0];

            // עדכון הנתונים בבטחה
            elements.temp.innerText = `${Math.round(latest.temp)}°C`;
            elements.desc.innerText = latest.description;
            elements.city.innerText = latest.city;
            elements.icon.src = `https://openweathermap.org/img/wn/${latest.icon}@4x.png`;
            
            const percentage = Math.min(Math.max((latest.temp / 40) * 100, 0), 100);
            elements.bar.style.width = percentage + '%';

            // מילוי היסטוריה
            elements.history.innerHTML = ''; 
            data.forEach(entry => {
                const time = new Date(entry.timestamp).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'});
                const card = `
                    <div class="history-item">
                        <span class="time">${time}</span>
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
setInterval(() => {
    console.log("Checking for new data...");
    updateWeather();
}, 60000);

window.onload = updateWeather;