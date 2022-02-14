const API_KEY = "19dff66ae9ef9be4d7a1256d7513ff13";
const DOM_ELEMENTS = {
  weather: document.querySelector(".weather"),
  error: document.querySelector(".error"),
  placeInput: document.querySelector(".place-input"),
  searchForm: document.querySelector(".form"),
};

const url = {
  geoCoding: (cityName, limit = 4) =>
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${API_KEY}`,
  weather: (lat, lon) =>
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
};

const fetchGeoCode = async (searchTerm) => {
  try {
    const response = await fetch(url.geoCoding(searchTerm));
    const data = await response.json();
    if (data.length === 0) throw new Error("No place found");
    return data[0];
  } catch (err) {
    throw new Error(err.message);
  }
};

const fetchWeather = async (lat, lon) => {
  try {
    const response = await fetch(
      url.weather(lat, lon, "minutely,hourly,daily")
    );
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateWeather = async () => {
  DOM_ELEMENTS.error.innerHTML = "Loading...";
  try {
    const place = DOM_ELEMENTS.placeInput.value;
    const geoData = await fetchGeoCode(DOM_ELEMENTS.placeInput.value);
    console.log(geoData);
    const weatherData = await fetchWeather(geoData.lat, geoData.lon);
    console.log(weatherData);
    DOM_ELEMENTS.error.innerHTML = "";
    // add weather to weather section and error section to ''
    DOM_ELEMENTS.weather.innerHTML = createWeatherCardDOM(weatherData, place);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    DOM_ELEMENTS.error.innerHTML = error.message;
    DOM_ELEMENTS.weather.innerHTML = "";
  }
  DOM_ELEMENTS.placeInput.value = "";
};

DOM_ELEMENTS.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  updateWeather();
});

const createWeatherCardDOM = (weatherData, place) => {
  return `
		<div class="card">
			<div class="card-header">
				<h2>${place + ` (${weatherData.sys.country})`}</h2>
				<p>${weatherData.weather[0].description}</p>
			</div>
			<div class="card-body">
				<p>Temperature : <span className="value">${
          weatherData.main.temp + "<sup>o</sup>" + " C"
        }</span></p>
				<p>Feels Like : <span className="value">${
          weatherData.main.feels_like + "<sup>o</sup>" + " C"
        }</span></p>
				<p>Humidity : <span className="value">${
          weatherData.main.humidity + " %"
        }</span></p>
				<p>Wind Speed : <span className="value">${
          weatherData.wind.speed + " m/s"
        }</span></p>
				<p>Cloudiness : <span className="value">${
          weatherData.clouds.all + " %"
        }</span></p>
			</div>
		</div>
	`;
};
