//get current weather for Kahshe Lake
async function getWeather() {
    const reqUrl = `https://api.openweathermap.org/data/2.5/weather?lat=43.65107&lon=-79.347015&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };

    let response = await fetch(reqUrl, options);

    return response.json();
}
  
  module.exports = {
    getWeather
  }