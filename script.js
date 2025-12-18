const apiKey = 'YOUR-API-KEY'; 

const animations = {
    '01d': 'https://lottie.host/6265691e-3603-4674-84c4-f254924c8856/8tC9Eis3wV.json',
    '01n': 'https://lottie.host/02005481-8758-450e-9407-7484df6231e3/941RzS7n6l.json',
    '02d': 'https://lottie.host/27f4d224-e2a2-466d-927a-899478479e3f/oN0g765Y1o.json',
    '02n': 'https://lottie.host/57f59d64-e74c-473d-9d48-89c0966a40a8/h8C29f0M6l.json',
    '03d': 'https://lottie.host/a6109968-3e58-4993-9d41-38374a2b2512/L0y9vN5K7k.json',
    '09d': 'https://lottie.host/49151590-7f39-4974-8622-c3132e676f2d/I9R7m3oG2j.json',
    '11d': 'https://lottie.host/791c107c-9b8e-4a8a-9f8e-d9c026c48398/z8N2o0D9l4.json',
    '13d': 'https://lottie.host/80e31846-9f8a-4952-9477-8490a6e4514a/u7H2n3P5l1.json'
};

window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        }, () => { getWeather('London'); });
    } else { getWeather('London'); }
};

async function fetchWeatherByCoords(lat, lon) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const [currRes, foreRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
        const currData = await currRes.json();
        const foreData = await foreRes.json();
        if (currData.cod === 200) updateUI(currData, foreData.list);
    } catch (e) { console.error(e); }
}

async function getWeather(inputCity) {
    const city = inputCity || document.getElementById('city').value;
    if (!city) return;
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const [currRes, foreRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
        const currData = await currRes.json();
        const foreData = await foreRes.json();
        if (currData.cod === 200) updateUI(currData, foreData.list);
        else alert(currData.message);
    } catch (e) { alert("Location not found"); }
}

function updateUI(curr, forecast) {
    const stage = document.querySelector('.main-stage');
    stage.classList.remove('animate');
    void stage.offsetWidth;
    stage.classList.add('animate');

    document.getElementById('temp-div').innerText = `${Math.round(curr.main.temp)}°`;
    document.getElementById('weather-info').innerHTML = `<h2>${curr.name}</h2><p>${curr.weather[0].description}</p>`;
    
    const iconCode = curr.weather[0].icon;
    const lottieContainer = document.getElementById('lottie-container');
    lottieContainer.innerHTML = `<dotlottie-wc src="${animations[iconCode] || animations['01d']}" background="transparent" speed="1" style="width: 350px; height: 350px;" loop autoplay></dotlottie-wc>`;

    const forecastDiv = document.getElementById('hourly-forecast');
    forecastDiv.innerHTML = '';
    forecast.slice(0, 8).forEach((item, i) => {
        const time = new Date(item.dt * 1000).getHours();
        forecastDiv.innerHTML += `
            <div class="hourly-item" style="animation: fadeInUp 0.5s ease forwards ${i * 0.1}s; opacity:0;">
                <span>${time}:00</span>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                <span>${Math.round(item.main.temp)}°</span>
            </div>
        `;
    });
}