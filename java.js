const API_KEY = "b3011ae4da194e1cafd140458252004";
const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";

// Function to format date
function formatDate(date) {
  const options = { weekday: "long", day: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
}

// Function to get next days
function getNextDays(startDate, count) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + i);
    days.push(formatDate(nextDate));
  }
  return days;
}

document.getElementById("weatherForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  fetchWeatherData(city);
});

function fetchWeatherData(city) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${city}&days=3`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      displayWeatherData(data);
      document.getElementById("errorMessage").classList.add("d-none");
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      document.getElementById("errorMessage").classList.remove("d-none");
      document.getElementById("weatherResult").classList.add("d-none");
    });
}

function displayWeatherData(data) {
  const weatherResult = document.getElementById("weatherResult");
  weatherResult.classList.remove("d-none");

  // Get current date and next days
  const currentDate = new Date();
  const nextDays = getNextDays(currentDate, 3);

  // Update today's weather
  document.getElementById("day").textContent = nextDays[0].split(",")[0];
  document.getElementById("date").textContent = nextDays[0]
    .split(",")[1]
    .trim();
  document.getElementById(
    "cityName"
  ).textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById(
    "temperature"
  ).textContent = `${data.current.temp_c}°C`;
  document.getElementById("weatherIcon").className = getWeatherIconClass(
    data.current.condition.code
  );
  document.getElementById("weatherDescription").textContent =
    data.current.condition.text;
  document.getElementById("humidity").textContent = `${data.current.humidity}%`;
  document.getElementById(
    "windSpeed"
  ).textContent = `${data.current.wind_kph} km/h`;
  document.getElementById("windDirection").textContent = data.current.wind_dir;

  // Update next days forecast
  data.forecast.forecastday.slice(1).forEach((day, index) => {
    const dayIndex = index + 2; // Start from 2 for the second and third cards
    const dayName = nextDays[index + 1].split(",")[0];
    const date = nextDays[index + 1].split(",")[1].trim();
    const maxTemp = day.day.maxtemp_c;
    const condition = day.day.condition.text;
    const conditionCode = day.day.condition.code;

    // Update day and date
    document.getElementById(`day${dayIndex}`).textContent = dayName;
    document.getElementById(`date${dayIndex}`).textContent = date;

    // Update temperature and icon
    document.getElementById(
      `temperature${dayIndex}`
    ).textContent = `${maxTemp}°C`;
    document.getElementById(`weatherIcon${dayIndex}`).className =
      getWeatherIconClass(conditionCode);

    // Update weather description
    document.getElementById(`weatherDescription${dayIndex}`).textContent =
      condition;
  });
}

function getWeatherIconClass(code) {
  const iconMap = {
    1000: "fas fa-sun", // Sunny
    1003: "fas fa-cloud-sun", // Partly cloudy
    1006: "fas fa-cloud", // Cloudy
    1009: "fas fa-cloud", // Overcast
    1030: "fas fa-smog", // Mist
    1063: "fas fa-cloud-rain", // Patchy rain
    1066: "fas fa-snowflake", // Patchy snow
    1069: "fas fa-cloud-rain", // Patchy sleet
    1072: "fas fa-cloud-rain", // Patchy freezing drizzle
    1087: "fas fa-bolt", // Thundery outbreaks
    1114: "fas fa-wind", // Blowing snow
    1117: "fas fa-snowflake", // Blizzard
    1135: "fas fa-smog", // Fog
    1147: "fas fa-smog", // Freezing fog
    1150: "fas fa-cloud-rain", // Patchy light drizzle
    1153: "fas fa-cloud-rain", // Light drizzle
    1168: "fas fa-cloud-rain", // Freezing drizzle
    1171: "fas fa-cloud-rain", // Heavy freezing drizzle
    1180: "fas fa-cloud-rain", // Patchy light rain
    1183: "fas fa-cloud-rain", // Light rain
    1186: "fas fa-cloud-rain", // Moderate rain
    1189: "fas fa-cloud-rain", // Heavy rain
    1192: "fas fa-cloud-rain", // Light freezing rain
    1195: "fas fa-cloud-rain", // Heavy freezing rain
    1198: "fas fa-cloud-rain", // Light sleet
    1201: "fas fa-cloud-rain", // Moderate or heavy sleet
    1204: "fas fa-cloud-rain", // Light snow
    1207: "fas fa-snowflake", // Moderate or heavy snow
    1210: "fas fa-snowflake", // Patchy light snow
    1213: "fas fa-snowflake", // Light snow
    1216: "fas fa-snowflake", // Patchy moderate snow
    1219: "fas fa-snowflake", // Moderate snow
    1222: "fas fa-snowflake", // Patchy heavy snow
    1225: "fas fa-snowflake", // Heavy snow
    1237: "fas fa-snowflake", // Ice pellets
    1240: "fas fa-cloud-rain", // Light rain shower
    1243: "fas fa-cloud-rain", // Moderate or heavy rain shower
    1246: "fas fa-cloud-rain", // Torrential rain shower
    1249: "fas fa-cloud-rain", // Light sleet showers
    1252: "fas fa-cloud-rain", // Moderate or heavy sleet showers
    1255: "fas fa-snowflake", // Light snow showers
    1258: "fas fa-snowflake", // Moderate or heavy snow showers
    1261: "fas fa-snowflake", // Light showers of ice pellets
    1264: "fas fa-snowflake", // Moderate or heavy showers of ice pellets
    1273: "fas fa-bolt", // Patchy light rain with thunder
    1276: "fas fa-bolt", // Moderate or heavy rain with thunder
    1279: "fas fa-bolt", // Patchy light snow with thunder
    1282: "fas fa-bolt", // Moderate or heavy snow with thunder
  };

  return iconMap[code] || "fas fa-cloud";
}
