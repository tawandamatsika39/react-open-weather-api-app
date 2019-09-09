import React from 'react';
import ReactDOM from 'react-dom';
import fetch from "isomorphic-fetch";
import './index.css';
import * as serviceWorker from './serviceWorker';
import { WiThermometer, WiBarometer, WiHumidity } from "weather-icons-react";

var QUERY = "https://api.openweathermap.org/data/2.5/weather?q=";
const WEATHER_API_KEY =process.env.REACT_APP_WEATHER_API_KEY;
//console.log(process.env.REACT_APP_WEATHER_API_KEY);

const FieldsForm = (props) => {
    return (
        <div className="col-sm-6 offset-sm-3 text-center">
		<h1>Weather App</h1>
		<div className="form-group">
		<form onSubmit={props.mySubmitHandler}>
            <div>
              <p>Enter city name:</p>
              <input type="text" onChange={props.myChangeHandler} />
              <br />
              <br />
              <input type="submit" />
            </div>
          </form>
          </div>
          </div>
    );
}

const roundToTwo = (num) => {
        return +(Math.round(num + "e+2") + "e-2");
    }

class Data extends React.Component {
    constructor(props) {
        super(props);
        this.state = { weather: [], not_found: false };
    }

    componentDidMount() {
        fetch(QUERY + this.props.city + WEATHER_API_KEY)
            .then(res => res.json())
            .then(
                result => {
                    if (result.main) {
                        this.setState({
                            weather: Object.entries(result.main)

                        });
                    } else {
                        this.setState({ not_found: true });
                    }
                    console.log(result)
                },

                error => {
                    this.setState({
                        error
                    });
                }
            );

    }

    

    render() {
        if (this.state.not_found) {
            return (
                <div className="col-sm-6 offset-sm-3 text-center">
        	<p>404 Not Found</p>
      	</div>
            );
        }
        if (this.state.weather.length === 0) {
            return (
                <div className="col-sm-6 offset-sm-3 text-center">
        	<p>Loading ...</p>
      	</div>
            );
        } else {
            return (
                <div className="col-sm-6 offset-sm-3 text-center">	
      	<div>
      		
        	<p>Temperature <WiThermometer size={28} color='#324ea8' /> : {roundToTwo(this.state.weather[0][1]-273.15)} degrees celcius</p>
        	<p>Pressure <WiBarometer size={28} color='#324ea8' /> :{roundToTwo(this.state.weather[1][1])} hPa</p>
        	<p>Humidity <WiHumidity size={28} color='#324ea8' />{roundToTwo(this.state.weather[2][1])} percent</p>

      	</div>
      	</div>
            );
        }
    }
}

class MyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { city: "", updated: false };
    }

    myChangeHandler = event => {
        this.setState({ city: event.target.value });
        this.setState({ updated: false });
    };

    mySubmitHandler = event => {
        event.preventDefault();
        this.setState({ updated: true });
        //console.log(this.state.city);
    };

    render() {
        if (this.state.updated) {
            return (
                <div>
          <FieldsForm mySubmitHandler={this.mySubmitHandler} myChangeHandler={this.myChangeHandler} />
          <Data city={this.state.city} />
        </div>
            );
        } else {
            return (
                <div>
          <FieldsForm mySubmitHandler={this.mySubmitHandler} myChangeHandler={this.myChangeHandler} />
        </div>
            );
        }
    }
}



ReactDOM.render(<MyForm />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();