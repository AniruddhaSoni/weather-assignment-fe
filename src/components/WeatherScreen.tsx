import React, { useEffect } from "react";
import IconSun from "./icons/IconSun";
import { FaThermometerEmpty } from "react-icons/fa";
import { RiContrastDrop2Fill } from "react-icons/ri";
import { GiSwanBreeze } from "react-icons/gi";
import { LuCloudRain } from "react-icons/lu";
import "./icons/weatherIcons.css";
import IconCloud from "./icons/IconCloud";
import IconRain from "./icons/IconRain";
import IconCloudSunRain from "./icons/IconCloudSunRain";
import IconSnow from "./icons/IconSnow";
import socketIOClient from "socket.io-client";

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}
interface WeatherIcons {
  [key: string]: JSX.Element; // Define an index signature for string keys that return JSX.Element
}

const IconCollection: WeatherIcons = {
  "01d": <IconSun />,
  "01n": <IconSun />,
  "02d": <IconSun />,
  "02n": <IconSun />,
  "03d": <IconCloud />,
  "03n": <IconCloud />,
  "04d": <IconCloud />,
  "04n": <IconCloud />,
  "09d": <IconRain />,
  "09n": <IconRain />,
  "10d": <IconRain />,
  "10n": <IconRain />,
  "11d": <IconCloudSunRain />,
  "11n": <IconCloudSunRain />,
  "13d": <IconSnow />,
  "13n": <IconSnow />,
  "50d": <IconSun />,
  "50n": <IconSun />,
};

export default function WeatherScreen() {
  const url = "https://weather-assignment-be.vercel.app";

  console.log(url);

  const [location, setLocation] = React.useState<Location | null>(null);
  const [weatherData, setWeatherData] = React.useState<any | null>(null);

  const socket = socketIOClient(url);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("messageFromClient", "Hello from client");
    });

    socket.on("messageFromServer", (data) => {
      setWeatherData(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const req = await fetch(`${url}/api/weather`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      const response = await req.json();
      const weatherData = response.weatherData;

      setWeatherData(weatherData);
      setLocation(weatherData.location);
    });
  }, []);

  return (
    <div className="neu-flat w-screen max-w-sm h-screen max-h-[700px] p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl text-center font-semibold text-black/70">
        {location && weatherData
          ? weatherData.location
          : "No location selected"}
      </h1>

      {/* weather card */}
      <div className="neu-flat w-10/12 mt-4 grid place-items-center aspect-square !rounded-full mx-auto">
        <div className="neu-flat w-11/12 grid place-items-center aspect-square !rounded-full mx-auto center">
          {/* <IconSun /> */}
          {!location && "N/A"}
          {location && weatherData && IconCollection[weatherData.icon]}
        </div>
      </div>

      {/* weather info */}

      <div className="w-11/12 grid grid-cols-2 gap-2 place-items-center mt-4 mx-auto text-4xl text-black/70">
        <div className="h-28 w-full neu-flat flex items-center justify-center">
          <FaThermometerEmpty className="" />
          <span className="text-3xl">
            {!location && "--"}
            {weatherData && location && weatherData.temperature}
            <sup>o</sup>C
          </span>
        </div>
        <div className="h-28 w-full neu-flat flex items-center justify-center">
          <RiContrastDrop2Fill className="" />
          <span className="text-3xl">
            {!location && "--"}
            {weatherData && location && weatherData.humidity}%
          </span>
        </div>
        <div className="h-28 w-full neu-flat flex items-center justify-center">
          <GiSwanBreeze className="" />
          <span className="text-3xl">
            {!location && "--"}
            {weatherData && location && weatherData.wind_speed}
            <span className="text-2xl">km/h</span>
          </span>
        </div>
        <div className="h-28 w-full neu-flat flex items-center justify-center">
          <LuCloudRain className="" />
          <span className="text-3xl">
            {!location && "--"}
            {weatherData && location && weatherData.rain}
            <span className="text-2xl">mm</span>
          </span>
        </div>
      </div>
    </div>
  );
}
