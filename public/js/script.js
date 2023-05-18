const weatherAPIKey = "b9c778e2c430dff13a8a4bb179d171fe";
const weatherImage = document.getElementById("weather-img");
const weatherCity = document.getElementById("weather-city");
const weatherDescription = document.getElementById("weather-des");

var weatherData = {};
var weatherArray = [];
var weatherLocation = {};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

async function getByCity(city = "Lahore") {
  weatherData = await fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=metric&appid=" +
      weatherAPIKey
  ).then((res) => res.json());

  // console.log(weatherData);
}

function arrange() {
  // console.log(weatherData);
  weatherLocation = { city: weatherData.city };

  function checkDate(date) {
    return weatherArray.some((el) => el.date == date);
  }

  weatherData.list.map((list) => {
    let date = list.dt_txt.split(" ")[0];
    let data = list;

    if (!checkDate(date)) {
      weatherArray.push({ date: date, data: [] });
    }

    weatherArray.map((weatherArrayData) => {
      if (weatherArrayData.date == date) {
        weatherArrayData.data.push({
          time: data.dt_txt.split(" ")[1],
          temp: data.main.temp,
          weather: data.weather[0],
        });
      }
    });
  });

  // console.log(weatherArray);
}

function display() {
  document.getElementById("weatherDates").innerHTML = "";

  weatherArray.map((weatherInfo, index) => {
    const icon = weatherInfo.data[0].weather.icon;
    const date = new Date(weatherInfo.date);
    const newDate = `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;

    let dateCard = `
    <div class="card shadow-sm border-0" data-id="${index}">
      <img class="card-img-top text-center drop-shadow" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
      <div class="card-body pt-0">
        <b class="card-text">${newDate}</b>
      </div>
    </div>
    `;
    document
      .getElementById("weatherDates")
      .insertAdjacentHTML("beforeend", dateCard);
    setWeatherCard(0);
  });

  function setWeatherCard(id) {
    document.getElementById("indicators").innerHTML = "";
    document.getElementById("weatherCards").innerHTML = "";
    const weatherObj = weatherArray[id];
    // console.log(weatherObj);
    const weatherCards = [];

    function eachToUpperCase(words) {
      let formatted = [];

      words.split(" ").map((word) => {
        formatted.push(word.charAt(0).toUpperCase() + word.substring(1));
      });
      return formatted.join(" ");
    }
    function formatTime(dateTime) {
      let hours = dateTime.getHours();
      let minutes = dateTime.getMinutes();
      const AM_PM = hours >= 12 ? "PM" : "AM";

      hours = hours > 12 ? hours - 12 : hours;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      const time = hours + ":" + minutes + " " + AM_PM;

      return time;
    }

    Object.values(weatherObj.data).map((weatherObjData, weatherDataIndex) => {
      // console.log(weatherObjData);
      let active = "";
      const icon = weatherObjData.weather.icon;
      const country = weatherLocation.city.country;
      const city = weatherLocation.city.name;
      const temp = weatherObjData.temp;
      const weatherCondition = weatherObjData.weather.main;
      const weatherConditionDes = eachToUpperCase(
        weatherObjData.weather.description
      );
      let dateTime = new Date(weatherObj.date + " " + weatherObjData.time);
      const day = days[dateTime.getDay()];
      const date = `${dateTime.getDate()} ${
        months[dateTime.getMonth()]
      } ${dateTime.getFullYear()}`;
      const time = formatTime(dateTime);
      if (weatherDataIndex == 0) {
        active = "active";
      }

      const weatherIndicator = `
      <button type="button" data-bs-target="#weatherCarousel" data-bs-slide-to="${weatherDataIndex}" class="${active}"></button>
      `;

      const weatherCard = `

      
    <div class="carousel-item ${active}">
      <div class="card-body p-4">
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-8">
                <h1 class="display-5">${city}, ${country} </h1>
                <p class="h5">${time}</p>
              </div>
              <div class="col-4 d-flex flex-column justify-content-end align-items-end">
                <p class="h3">${day}</p>
                <p class="h5">${date}</p>
              </div>
            </div>
          </div>
          <div class="col-6 text-center">
            <img class="img-fluid drop-shadow" src="https://openweathermap.org/img/wn/${icon}@4x.png" />
          </div>
          <div class="col-6 text-center d-flex flex-column justify-content-center">
            <p class="display-1">${Math.ceil(temp)}</p>
            <p class="h4 text-center">${weatherConditionDes}</p>
          </div>
        </div>
    </div>
  </div>
  `;

      document
        .getElementById("indicators")
        .insertAdjacentHTML("beforeend", weatherIndicator);
      document
        .getElementById("weatherCards")
        .insertAdjacentHTML("beforeend", weatherCard);
    });
  }

  [...document.getElementById("weatherDates").children].map((child) => {
    const id = child.getAttribute("data-id");
    child.addEventListener("click", function () {
      setWeatherCard(id);
    });
    // console.log(child.getAttribute("data-id"));
  });
}

document.getElementById("search").onchange = function (e) {
  console.log(this.value);
  console.log(e.target.value);
  getByCity(this.value).then(() => {
    arrange();
    display();
  });
  // weatherImage.setAttribute("src", "");
  //   weather.textContent = ;
};

window.onload = function () {
  getByCity().then(() => {
    arrange();
    display();
  });
};
