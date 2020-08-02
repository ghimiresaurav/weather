const table = document.querySelector("table");
const tbody = document.querySelector("tbody");
const input = document.querySelector("input");
const form = document.querySelector("form");
const disp = document.getElementById("displayer");
const loc = document.getElementById("location");
const moreBtn = document.getElementById("more-btn");
let apikey = "147476f08e5f6ea436a262512e7efd13", data, count = 1, dispHeight = 220, risk;

const success = (pos) =>{
    const coord = pos.coords;
    lat = coord.latitude;
    lon = coord.longitude;
    getWeather(lat, lon);
}
const error = (err) => console.log(`ERROR: ${err.code}: ${err.message}`);
navigator.geolocation.getCurrentPosition(success, error);

form.addEventListener("submit", function(){
    if(loc.value != ""){
        let location = capitalize(loc.value);
        if(location == "Prakashpur")
        getWeather(26.68, 87.09);
    }
})
function capitalize(string){
    let str = "";
    for(let i=1; i<string.length; i++)
    str += string[i].toLowerCase();
    return string[0].toUpperCase()+str;
}
function getWeather(lat, lon){
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apikey}`;
    fetch(url).then((resp)=>resp.json()
    ).then(function(info){
        data = info;
        displayer();
    }).catch((err)=>console.log(err));
}
(function ensure(){
    if(!data)
        setTimeout(ensure, 500);
})();
function displayer(){
    document.getElementById("name").innerText = `Time Zone: ${data.timezone}`;
    let weatherIcon = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;  
    const riseTime = new Date(data.current.sunrise*1000);
    const setTime = new Date(data.current.sunset*1000);
    let row = document.createElement("tr");
    row.style.height = `110px`;
    row.innerHTML = `<td><strong>Current</strong></td>
                    <td><img src=${weatherIcon} alt="Weather Icon"></td>
                    <td>${(data.current.temp-273).toFixed(2)}°C</td>
                    <td>${(data.current.feels_like-273).toFixed(2)}°C</td>
                    <td>${data.current.clouds}%</td>
                    <td>${data.current.humidity}%</td>
                    <td>${(data.current.pressure*0.000986923).toFixed(2)}atm</td>
                    <td>${(data.current.wind_speed*3.6).toFixed(2)}km/hr</td>
                    <td>${direction(data.current.wind_deg)}</td>`;
    tbody.append(row);             
    let things = document.createElement("div");
    things.innerHTML = `<div id="rise"><strong>Sunrise: </strong>${riseTime.getHours()}:${riseTime.getMinutes()} AM</div>
                        <div id="set"><strong>Sunset: </strong>${setTime.getHours()-12}:${setTime.getMinutes()} PM</div>
                        <div id="uvi"><strong>Ultra Violet Index:</strong><div id="uvi-color" style="background-color:${uvIndex(data.current.uvi)}">${risk}</div></div>`;
    document.getElementById("info").append(things);   
}
function moreData(){
    let datum = data.hourly[count], h, m, time, daytime;
    let newWeatherIcon = `http://openweathermap.org/img/wn/${datum.weather[0].icon}@2x.png`;  
    dispHeight+=110;
    disp.style.height = `${dispHeight}px`;
    time = new Date(datum.dt*1000);
    h = time.getHours();
    m = time.getMinutes();
    if(h<12)
    daytime = "AM";
    else{
        daytime = "PM";
        h-=12;
    }
    if(h==0)
    h=12;
    let newRow = document.createElement("tr");
    newRow.innerHTML = `<td><strong>${h}:${m} ${daytime}</strong></td>
                        <td><img src=${newWeatherIcon} alt="Weather Icon"></td>
                        <td>${(datum.temp-273).toFixed(2)}°C</td>
                        <td>${(datum.feels_like-273).toFixed(2)}°C</td>
                        <td>${datum.clouds}%</td>
                        <td>${datum.humidity}%</td>
                        <td>${(datum.pressure*0.000986923).toFixed(2)}atm</td>
                        <td>${(datum.wind_speed*3.6).toFixed(2)}km/hr</td>
                        <td>${direction(datum.wind_deg)}</td>`
    tbody.append(newRow);
    console.log(datum);
    count++;
}
function direction(deg){
    if(11.25<=deg && deg<=33.75)
    return "North NorthEast";
    else if(33.75<=deg && deg<=56.25)
    return "North East";
    else if(56.25<=deg && deg<=78.75)
    return "East NorthEast";
    else if(78.75<=deg && deg<=101.25)
    return "East";
    else if(101.25<=deg && deg<=123.75)
    return "East SouthEast";
    else if(123.75<=deg && deg<=146.25)
    return "South East";
    else if(146.25<=deg && deg<=168.75)
    return "South SouthEast";
    else if(168.75<=deg && deg<=191.25)
    return "South";
    else if(191.25<=deg && deg<=213.75)
    return "South SouthWest";
    else if(213.75<=deg && deg<=236.25)
    return "South West";
    else if(236.25<=deg && deg<=258.75)
    return "West SouthWest";
    else if(258.75<=deg && deg<=281.25)
    return "West";
    else if(281.25<=deg && deg<=303.75)
    return "West NorthWest";
    else if(303.75<=deg && deg<=326.25)
    return "North West";
    else if(326.25<=deg && deg<=348.75)
    return "North NorthWest";
    else
    return "North";
}
function uvIndex(index){
    if(0<=index && index<=2){
        risk = "Low";
        return "#008000";
    }
    else if(3<=index && index<=5){
        risk = "Moderate";
        return "#ffff00"
    }
    else if(6<=index && index<=7){
        risk = "High";
        return "#ffa500";
    }
    else if(8<=index && index<=10){
        risk = "Very High";
        return "#ff0000";
    }
    else if(11<=index){
        risk = "Extreme";
        return "#ee82ee";
    }
}  

table.style.position = "absolute";
table.style.left = "5%";
table.style.width = "90%";
table.style.textAlign = "center";
table.style.marginTop = "15px";

input.style.width = "70%";
input.style.height = "80%";
input.style.outline = "none";
input.style.border = "none";
input.style.transition = "350ms";
input.style.fontFamily = "'Poppins', sans-serif";
input.style.fontSize = "15px";
input.style.borderBottom = "2px solid cyan";

form.style.position = "absolute";
form.style.width = "30%";
form.style.left = "70%";
form.style.height = "40px";
form.style.display = "flex";
form.style.alignItems = "center";
form.style.fontSize = "15px";

moreBtn.style.position = "absolute";
moreBtn.style.top = "100%";
moreBtn.style.left = "90%";
moreBtn.style.height = "auto";
moreBtn.style.width = "auto";
moreBtn.style.padding = "5px 10px";
moreBtn.style.marginTop = "10px";
