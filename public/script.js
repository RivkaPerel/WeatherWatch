// פונקציה להצגת הנתונים על המסך
async function updateWeather() {
    try {
        // משיכת הנתונים מה-API שבנינו ב-Backend
        const response = await fetch('/api/history');
        const data = await response.json();

        if (data.length > 0) {
            // לוקחים את הדגימה האחרונה שנוספה
            const latest = data[0]; 

            // עדכון הכרטיס הראשי
            document.getElementById('temp').innerText = `${latest.temperature}°C`;
            document.getElementById('description').innerText = latest.description;
            document.getElementById('city-name').innerText = latest.city;

            // עדכון הטבלה
            const tableBody = document.getElementById('history-table');
            tableBody.innerHTML = ''; // ניקוי הטבלה לפני מילוי מחדש

            data.forEach(entry => {
                const date = new Date(entry.timestamp).toLocaleString('he-IL');
                const row = `
                    <tr>
                        <td>${date}</td>
                        <td>${entry.temperature}°C</td>
                        <td>${entry.description}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('description').innerText = 'שגיאה בטעינת נתונים';
    }
}

// הפעלת הפונקציה ברגע שהדף נטען
window.onload = updateWeather;