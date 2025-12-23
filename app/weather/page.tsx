"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeatherData = {
  temperature: number;
  windspeed: number;
  time: string;
};

export default function WeatherPage() {
  const [latitude, setLatitude] = useState("-26.2041");
  const [longitude, setLongitude] = useState("28.0473");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();

      setWeather({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        time: data.current_weather.time,
      });
    } catch {
      setError("Something went wrong while fetching the weather.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🌤 Weather App</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <Input
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />

          <Button onClick={fetchWeather} className="w-full">
            {loading ? "Loading..." : "Get Weather"}
          </Button>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {weather && (
            <div className="text-sm space-y-1">
              <p>🌡 Temperature: {weather.temperature}°C</p>
              <p>💨 Wind Speed: {weather.windspeed} km/h</p>
              <p>⏱ Time: {weather.time}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
