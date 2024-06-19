import {useState, useEffect} from "react";
  
export default function Weather() {
const [weather, setWeather] = useState(null);

useEffect(() => {
    const getWeather = async () => {
    let response = await fetch("https://meadowview-cottage-resort.vercel.app/api/weather");
    let data = await response.json();
    setWeather(data);
    }
    getWeather();
}, []);

if (!weather) {
    return <div></div>;
    }

// concatenate to get url of icon using icon's id
const iconUrl = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png";

// round temperatures
const roundedTemp = Math.round(weather.main.temp);
const roundedFeelsLike = Math.round(weather.main.feels_like);
const roundedMin = Math.round(weather.main.temp_min);
const roundedMax = Math.round(weather.main.temp_max);

// make first letter of conditions description an uppercase
const stringConditions = String(weather.weather[0].description);
const UppercaseConditions = stringConditions.charAt(0).toUpperCase() + stringConditions.slice(1);

// convert sunrise (unix, UTC) to user friendly time
const sunriseDate = new Date(weather.sys.sunrise * 1000); // multiply by 1000 to convert from seconds (unix) to milliseconds (js)
var sunriseHour = sunriseDate.getHours();
var sunriseMinute = sunriseDate.getMinutes();
// convert time from 24 hour clock format to 12 hour clock format
var sunriseTimeOfDay;
if (sunriseHour > 12){
    sunriseHour = sunriseHour % 12;
    sunriseTimeOfDay = "pm";
    if (sunriseHour === 24){
        sunriseHour = 12;
        sunriseTimeOfDay = "am";
    }
} else{
    sunriseTimeOfDay = "am";
}


// function to convert unix, UTC to user friendly time
function convertUnix(unix){

    const time = new Date(unix * 1000); // multiply by 1000 to convert from seconds (unix) to milliseconds (js)
    var hour = time.getHours();
    var minute = time.getMinutes();

    // convert time from 24 hour clock format to 12 hour clock format
    var timeOfDay;
    if (hour > 12){
        hour = hour % 12;
        timeOfDay = "pm";
        if (hour === 24){
            hour = 12;
            timeOfDay = "am";
        }
    } else{
        timeOfDay = "am";
    }

    var convertedTime = hour + ":" + minute + timeOfDay;
    return convertedTime;
}

//convert sunrise and sunset (unix, UTC) to user friendly time
const sunrise = convertUnix(weather.sys.sunrise);
const sunset = convertUnix(weather.sys.sunset);

//convert wind from m/s to km/h and round
const windKmh = weather.wind.speed * 3.6;
const roundedWind = Math.round(windKmh);

//get the current date
const currentDate = new Date().toDateString();

return (
    <div id="weatherContainer">
        <div id="weatherContent">
            <div>
                <h3>{currentDate}</h3>
                <div id="currentWeather">
                    <div id="weatherData">
                        <p>{UppercaseConditions}</p>
                        <p id="temp" className="bold">{roundedTemp}°C</p>
                        <p>Feels like {roundedFeelsLike}°C</p>
                        <div id="lowHigh">
                            <p><span className="bold">L:</span> {roundedMin}°C</p>
                            <p><span className="bold">H:</span> {roundedMax}°C</p>
                        </div>  
                        <p><span className="bold">Sunrise:</span> {sunrise}</p>
                        <p><span className="bold">Sunset:</span> {sunset}</p>
                        <p><span className="bold">Wind:</span> {roundedWind}km/h</p>
                    </div>
                    <div>
                        <img src={iconUrl} alt={UppercaseConditions} />
                    </div>
                </div>
                <h3>It's the perfect day for...</h3>
            </div>
        </div>
    </div>
    );
}