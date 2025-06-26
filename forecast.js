const API_KEY = "37a21ee58be1454883b123745230504";
const citySelect = document.querySelector("#city-select");
const field = document.querySelector("#search");
const daysSelect = document.querySelector("#days-select");
const btn = document.querySelector("#get-forecast");
const weatherOutput = document.querySelector("#forecast-output");
const spanError = document.querySelector("#error-message");
let currentCity = citySelect.value;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

function getForecast(city, days) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`;
    fetch(url).then(async response => {
        if (response.status === 400) {
            weatherOutput.innerHTML = "";
            showError("Місто не знайдено");
            return;
        }
        clearError();
        const data = await response.json();
        currentCity = data.location.name;
        renderForecast(data);
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function renderForecast(data) {
    const forecastDays = data.forecast.forecastday;
    let html = `<h2>${data.location.name}</h2>`;
    forecastDays.forEach(day => {
        html += `
          <div class="forecast-day reveal">
            <h3>${formatDate(day.date)}</h3>
            <div class="hourly">
              ${day.hour.map((hour, i) => `
                <div class="hour-block reveal" style="--i: ${i}" data-day="${day.date}" data-hour-index="${i}">
                  <div>${hour.time.split(" ")[1]}</div>
                  <img src="https:${hour.condition.icon}" alt="">
                  <div>${hour.temp_c}°C</div>
                </div>`).join('')}
            </div>
          </div>`;
    });
    
    weatherOutput.innerHTML = html;
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    document.querySelectorAll('.hour-block').forEach(block => {
        block.addEventListener('click', () => {
            const day = block.getAttribute('data-day');
            const hourIndex = +block.getAttribute('data-hour-index');
            const dayData = forecastDays.find(d => d.date === day);
            const hourData = dayData.hour[hourIndex];
            showModal(hourData);
        });
    });
}

function showModal(hourData) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>Погода на ${hourData.time.split(" ")[1]}</h3>
        <div class="weather-header" style="justify-content: center; gap: 15px;">
          <img src="https:${hourData.condition.icon}" alt="${hourData.condition.text}" />
          <div style="font-weight: 600; font-size: 1.2rem; color: #34495e;">${hourData.condition.text}</div>
        </div>
        <div class="weather-details" style="margin-top: 20px;">
          <div class="detail"><span>Температура:</span><div>${hourData.temp_c} °C</div></div>
          <div class="detail"><span>Відчувається як:</span><div>${hourData.feelslike_c} °C</div></div>
          <div class="detail"><span>Швидкість вітру:</span><div>${hourData.wind_kph} км/год</div></div>
          <div class="detail"><span>Пориви вітру:</span><div>${hourData.gust_kph} км/год</div></div>
          <div class="detail"><span>Напрямок вітру:</span><div>${hourData.wind_dir}</div></div>
          <div class="detail"><span>Хмарність:</span><div>${hourData.cloud} %</div></div>
          <div class="detail"><span>Вологість:</span><div>${hourData.humidity} %</div></div>
          <div class="detail"><span>Тиск:</span><div>${hourData.pressure_mb} мБ</div></div>
        </div>`;
    
    modal.style.display = "block";
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    void modalContent.offsetWidth;
    modalContent.classList.add('show');
    animateDetails();
}

document.getElementById('modal-close').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
});

btn.addEventListener("click", () => {
    const city = field.value.trim();
    if (city) getForecast(city, parseInt(daysSelect.value));
});

citySelect.addEventListener("change", () => getForecast(citySelect.value, parseInt(daysSelect.value)));
daysSelect.addEventListener("change", () => getForecast(currentCity, parseInt(daysSelect.value)));
getForecast(currentCity, parseInt(daysSelect.value));

function showError(message) {
    spanError.textContent = message;
    spanError.style.display = "block";
}

function clearError() {
    spanError.textContent = "";
    spanError.style.display = "none";
}

function animateDetails() {
    const details = document.querySelectorAll('.modal-content .detail');
    details.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.1 + 0.2}s`;
        el.style.animationName = 'fadeInUp';
    });
}
