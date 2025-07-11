import { env } from "@/config/env";
import { createAppError } from "@/http/errors/appError";
import { FastifyReply, FastifyRequest } from "fastify";

function fahrenheitToCelsius(fahrenheit: number) {
  return parseFloat((((fahrenheit - 32) * 5) / 9).toFixed(1));
}
interface RawDataFormat {
  resolvedAddress: string;
  currentConditions: {
    temp: number;
    feelslike: number;
    humidity: number;
    conditions: string;
  };
  days: {
    datetime: Date;
    tempmax: number;
    tempmin: number;
    conditions: string;
    precipprob: number;
  }[];
}

export const getForecast = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { city } = request.params as { city: string };
  if (!city) {
    throw createAppError("City parameter is missing in the request.", 400);
  }
  const url = env.API_URL.concat(`/${city}?key=${env.API_KEY}`);
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw createAppError(
      `Error to search forecast data: ${errorText}`,
      response.status
    );
  }
  const rawData = (await response.json()) as RawDataFormat;
  const formattedData = {
    info: {
      city: rawData.resolvedAddress.split(",")[0].trim(),
      state: rawData.resolvedAddress.split(",")[1].trim(),
      country: rawData.resolvedAddress.split(",")[2].trim(),
    },
    currentConditions: {
      currentTemperatureCelsius: fahrenheitToCelsius(
        rawData.currentConditions.temp
      ),
      currentTemperatureFahrentheit: rawData.currentConditions.temp,
      feelsLikeCelsius: fahrenheitToCelsius(
        rawData.currentConditions.feelslike
      ),
      feelsLikeFahrentheit: rawData.currentConditions.feelslike,
      humidity: rawData.currentConditions.humidity,
      conditions: rawData.currentConditions.conditions,
    },
    dailyForecast: rawData.days.slice(0, 5).map((day) => ({
      date: day.datetime,
      tempMaxCelsius: fahrenheitToCelsius(day.tempmax),
      tempMinCelsius: fahrenheitToCelsius(day.tempmin),
      tempMax: day.tempmax,
      tempMin: day.tempmin,
      condition: day.conditions,
      chanceRainPercentual: day.precipprob,
    })),
  };
  reply.status(200).send({
    data: formattedData,
  });
};
