const API_KEY = "37a21ee58be1454883b123745230504";
const btn = document.querySelector("#get-weather");
const citySelect = document.querySelector("#city-select");
const weatherOutput = document.querySelector("#weather-output");
const field = document.querySelector("#search");
const spanError = document.querySelector("#error-message");

function getWeather(city = "") {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
    fetch(url).then(async res => {
        if (res.status === 400) {
            weatherOutput.innerHTML = "";
            showError("City not found");
            return;
        }
        clearError();
        const data = await res.json();
        const temp = data.current.temp_c;

        weatherOutput.innerHTML = `
      <div class="weather-display">
        <div class="weather-header">
          <h2>${data.location.name},<br>${data.location.region ? data.location.region + ",<br>" : ""}${data.location.country}</h2>
          <img src="https:${data.current.condition.icon}">
        </div>
        <div class="weather-details">
          <div class="detail"><span>Temperature:</span>${temp} °C</div>
          <div class="detail"><span>Feelslike:</span>${data.current.feelslike_c} °C</div>
          <div class="detail"><span>Wind speed:</span>${data.current.wind_kph} км/год</div>
          <div class="detail"><span>Wind gust:</span>${data.current.gust_kph} км/год</div>
          <div class="detail"><span>Wind direction:</span>${data.current.wind_dir}</div>
          <div class="detail"><span>Clouds:</span>${data.current.cloud}%</div>
          <div class="detail"><span>Humidity:</span>${data.current.humidity}%</div>
          <div class="detail"><span>Pressure:</span>${data.current.pressure_mb} мБ</div>
        </div>
      </div>
    `;

        if (temp <= 0) document.body.style.background = "linear-gradient(135deg, #83a4d4, #b6fbff)";
        else if (temp <= 15) document.body.style.background = "linear-gradient(135deg, #a8edea, #fed6e3)";
        else if (temp <= 25) document.body.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
        else document.body.style.background = "linear-gradient(135deg, #f85032, #e73827)";
    });
}

function showError(message) {
    spanError.textContent = message;
    spanError.style.display = "block";
    weatherOutput.style.display = "none";
}

function clearError() {
    spanError.textContent = "";
    spanError.style.display = "none";
    weatherOutput.style.display = "block";
}

getWeather(citySelect.value);

citySelect.addEventListener("change", () => {
    getWeather(citySelect.value);
});

btn.addEventListener("click", () => {
    getWeather(field.value);
});
