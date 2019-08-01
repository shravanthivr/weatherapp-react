import React, { Fragment } from 'react';
import './App.css';
import axios from 'axios';
import Geocode from "react-geocode";
import WeatherInfo from './WeatherInfo/WeatherInfo';


class App extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            inputString : '',
            locArray : [],
            address: '',
            weatherInfoData : [],
            isAppLoaded :false
        };
    }

      //using geolocation
    componentDidMount () {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition (
                (position) => {
                this.setState({
                    locArray : [position.coords.latitude, position.coords.longitude],
                }, this.notifyWeatherUpdate);
            },
            (error) => {console.log(error.message);
            });
        } else {
            console.log ('Geolocation not available');
        }    
    } // end of componentDiDMount 

    notifyWeatherUpdate = () => {
        const haslocArray = this.state.locArray.length > 0;
        const hasCity = (this.state.inputString !== '');  
        const latlng =  `${this.state.locArray[0]},${this.state.locArray[1]}`;  
        const key= 'AIzaSyAG0x5CSf-pR0Z1fZ6zRjtRSgbOz6lsoQ8';

        if (haslocArray || hasCity) { 
            this.fetchWeatherData(haslocArray).then (forecastData => {
                this.setState ({
                    weatherInfoData : this.extractDataForCurrentWeather(forecastData),
                    isAppLoaded : true
                })
            }).catch (error => {
                console.log ('Error', error);
            });   
            
           // reverse geocoding     
          return fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${key}`)
              .then((res) => res.json())
              .then((data) => {
                if(data.status !== 'OK') {
                  throw new Error ('Geocode error : ${data.status}');
                 }
               this.setState ({
                address:  data.results[0].address_components[2].long_name + ',' + data.results[0].address_components[5].long_name,
                isAppLoaded : true
               });

            });
     
        } // end of haslocalArray..
    } // end of notifyweatherUpdate
        

    // fetching data
    fetchWeatherData = (haslocArray)=> {
        const API_KEY = 'e9ce53dc730b2080454872f4d62d454e'; // data sky key
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const BASE_URL = 'https://api.darksky.net/forecast';
        const exclude = "?exclude=minutely,hourly,alerts,flags";
        const queryParams = (haslocArray) ? `${this.state.locArray[0]},${this.state.locArray[1]}` : `q=${this.state.inputString}`;
        const unitType = (this.state.unit === 'C') ? 'metric' : 'imperial';

        const url = `${proxy}${BASE_URL}/${API_KEY}/${queryParams}${exclude}`;

        return axios.get(url).then(response => {
            return response.data;

            }).catch (error => {
            console.log ('error:',error);
        })

    }
    
    // Takes date object or unix timestamp in ms and returns day string
    getDay = (time) => {
        const daysNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday ", "Friday", "Saturday"];
        return daysNames[(new Date(time).getDay())];
    }


    extractDataForCurrentWeather = (forecastData) => {
        //console.log (forecastData);
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const latitude = forecastData.latitude;
        const longitude = forecastData.longitude;

        const todayForecast = forecastData.currently;
        const time = new Date(todayForecast.time * 1000);
        const day = this.getDay(time);
        const date = `${month[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;

        const description = todayForecast.summary;
        let mainTemperature = todayForecast.apparentTemperature;
        const icon = todayForecast.icon;
        const pressure = todayForecast.pressure;
        const humidity = todayForecast.humidity;
        const windSpeed = todayForecast.windSpeed;
    
        return {      
          date,
          time,
          day,
          description,
          mainTemperature,
          icon,
          pressure,
          humidity,
          windSpeed
        }
    } // end of extractData



    render () {
        const instructionLayout = <div className="app-instruction">
            <p>Allow Location Access  to get started.</p>
        </div>

        const mainAppLayout = <React.Fragment>
            <h1 className="header"><div className="title">WeatherApp</div></h1>
            <WeatherInfo weatherInfoData={this.state.weatherInfoData} address={this.state.address} />
        </React.Fragment>
        return (
            <div className="app-container">
                 {this.state.isAppLoaded ? mainAppLayout : instructionLayout}
            </div>
        );
    } // end of render 
} // end of App class

export default App;