const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        // invisible the userTab & grantAccessContainer
        // to make searchForm visible
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
             // to switch from search form to your weather
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //to display your weather info after reaching your weather tab
        // check local storage first for coordinates if we have saved them
            getfromSessionStorage();
        }
    }
}

// to switch to user tab
userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

// to switch to search tab and open search ui
searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});


// to check if co-ordinates already present in session storage
function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    // if localCoordinates are not there then grantAccessContainer tab will be active
    grantAccessContainer.classList.add("active")
  }
  else{
    // if permission of location is active then fetch the weather info
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}
 
// to fetch the user weather info
// api call that's why async function
async function fetchUserWeatherInfo(coordinates){
 const {lat, lon} = coordinates;

//  remove grantAccessContainer 
grantAccessContainer.classList.remove("active");

// make loading screeen active
loadingScreen.classList.add("active");

//API call
try{
 const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
);
//convert to Json
const data= await response.json();

// after fetching the data from API we have to remove the loadingScreen 
loadingScreen.classList.remove("active");

// to show ui of userInfoContainer
userInfoContainer.classList.add("active");

// to display the value of weather
renderWeatherInfo(data);
}
catch(err){
loadingScreen.classList.remove("active");
}
}

// to display the value of weather
function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}


function getLocation(){
    //get current location
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
         //show an alert for no gelolocation support available
    }
}

function showPosition(position){
    //fetchco-ordinates
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    //to display
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton= document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

//search
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    //set city name
    let cityName = searchInput.value;
   if(cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    // to display loading screen
    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
// API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          loadingScreen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
    }
    catch(err){
      console.error("Error fetching weather:", err);
alert("Failed to fetch weather info. Please try again.");
    }
}