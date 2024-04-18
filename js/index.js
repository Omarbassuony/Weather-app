async function search(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7db6a3db13124d7ab9402410241704&q=${location}&days=3`);
        if (!response.ok || response.status === 400) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        displayCurrent(data.location, data.current);
        displayAnother(data.forecast.forecastday);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

document.getElementById("search").addEventListener("keyup", async (event) => {
    await search(event.target.value);
});

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function displayCurrent(location, current) {
    if (current) {
        const lastUpdated = new Date(current.last_updated.replace(" ", "T"));
        const dayOfWeek = days[lastUpdated.getDay()];
        const dateOfMonth = lastUpdated.getDate();
        const month = monthNames[lastUpdated.getMonth()];

        const html = `<div class="today col-md-4">
            <div class="weather-header d-flex justify-content-between">
                <div class="day">${dayOfWeek}</div>
                <div class="date">${dateOfMonth} ${month}</div>
            </div>
            <div class="weather-content">
                <div class="location">${location.name}</div>
                <div class="degree d-flex align-items-center">
                    <div class="num">${current.temp_c}<sup>o</sup>C</div>
                    <div class="weather-icon">
                        <img src="https:${current.condition.icon}" alt="" width="90">
                    </div>
                </div>
                <div class="custom">${current.condition.text}</div>
                <span><img src="./imgs/icon-umberella.png" alt=""> 20%</span>
                <span><img src="./imgs/icon-wind.png" alt=""> 18km/h</span>
                <span><img src="./imgs/icon-compass.png" alt=""> East</span>
            </div>
        </div>`;
        
        document.getElementById("weather").innerHTML = html;
    }
}

function displayAnother(forecastDays) {
    let html = "";
    for (let i = 1; i < forecastDays.length; i++) {
        const dayOfWeek = days[new Date(forecastDays[i].date.replace(" ", "T")).getDay()];
        html += `<div class="tommorow col-md-4">
            <div class="weather-header">
                <div class="day">${dayOfWeek}</div>
            </div>
            <div class="weather-content">
                <div class="weather-icon">
                    <img src="https:${forecastDays[i].day.condition.icon}" alt="" width="48">
                </div>
                <div class="degree">${forecastDays[i].day.maxtemp_c}<sup>o</sup>C</div>
                <small>${forecastDays[i].day.mintemp_c}<sup>o</sup></small>
                <div class="custom">${forecastDays[i].day.condition.text}</div>
            </div>
        </div>`;
    }
    document.getElementById("weather").innerHTML += html;
}

search("cairo");
