#!/usr/bin/env node
const { Command } = require("commander");
require('dotenv').config();

const ApiKey=process.env.ApiKey;
const weatherBaseUrl=process.env.weatherUrl;

if (!ApiKey || !weatherBaseUrl) {
  console.error("Missing API key or base URL");
  process.exit(1);
}

const program = new Command();

async function fetch_weather_data(location,option) {
  try {
    const response = await fetch(`${weatherBaseUrl}/current.json?key=${ApiKey}&q=${location}&aqi=yes`);
    if (!response.ok) {
      throw new Error("API request failed");
    }
    const data = await response.json();
    const loc=data.current;
    console.log()
    console.log(`Weather report of ${data.location.name}`);
    if(option.f){
      console.log(`temprature ${loc.temp_f} F`);
    }
    else{
      console.log(`temprature ${loc.temp_c} C`);
    }
    
    console.log(`weather ${loc.condition.text}`);

  }
  catch (error) {
    console.log("something went wrong pls try again later");
    console.log(error);
  }
}

program
  .name('weather-cli')
  .description('CLI to fetch weather information')
  .version('0.8.0');


program.command('current')
  .description('Get current weather of a city ')
  .argument('<string>', 'name of the city')
  .option('--c', 'temprature in celsius ')
  .option('--f', 'temprature in fahrenheit')
  .action((location, option) => {

    fetch_weather_data(location,option);

  })

  program.parse(process.argv);