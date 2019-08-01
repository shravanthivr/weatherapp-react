import React from 'react';
import ReactAnimatedWeather from 'react-animated-weather';
import './WeatherInfo.css';
import './weather-icons/css/weather-icons.min.css';


class WeatherInfo extends React.Component {
  fixNaming(iconName) {
    return iconName.replace(/-/g, "_");
  }
 render() {
  const {   
    date,
    time,
    day,
    description,
    mainTemperature,
    icon, pressure,
    humidity, windSpeed} = this.props.weatherInfoData;

    const address = this.props.address;

     // skyicons
    const list  = [
      'CLEAR_DAY',
      'CLEAR_NIGHT',
      'PARTLY_CLOUDY_DAY',
      'PARTLY_CLOUDY_NIGHT',
      'CLOUDY','RAIN',
      'SLEET','SNOW',
      'WIND','FOG'
    ];
    const defaults = {
      icon: 'PARTLY_CLOUDY_DAY',
      color: 'goldenrod',
      size: 128,
      animate: true
    };
  
    var iconName = typeof icon === "undefined"? defaults.icon : list[this.fixNaming(icon.toUpperCase())]  ;
 
    return (
      <div>
        <div className = "location">
          <span>{address}</span>
        </div>
        <div className = "weather-container">
          <div className="date-container">
              <div>{day}</div>
              <div>{date}</div>
          </div>
          <div className="icon-container">
              <ReactAnimatedWeather icon={iconName} color={defaults.color}
                  size={defaults.size}
                  animate={defaults.animate}
              />
              <div className="weather-desc">{description}</div>
          </div>
          <div className="temp-container">
              <div className="temp-text">
                <span>{mainTemperature}</span>
                <i className="wi wi-degrees"></i>
                <span>F</span>
              </div>
          </div>
          <div className="extra-info-container">
            <div className="extra-info-item">
                <span><i className="wi wi-humidity"></i></span>
                <span>Humidity </span>
                <span>{humidity}%</span>
            </div>
            <div className="extra-info-item">
                <span><i className="wi wi-barometer"></i></span>
                <span>Pressure </span>
                <span>{pressure} hPa</span>
            </div>
            <div className="extra-info-item">
                <span><i className="wi wi-strong-wind"></i></span>
                <span>Wind Speed</span>
                <span>{windSpeed} </span>
            </div>
          </div>
        </div>
      </div >
    );

 }

}

export default WeatherInfo;