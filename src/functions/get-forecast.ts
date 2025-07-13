import { env } from "@/config/env";
import { createAppError } from "@/http/errors/appError";
import { getCityForecast, setCityForecast } from "@/lib/redis";
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
  request.log.info("=== GET FORECAST REQUEST STARTED ===");

  // Check params
  const { city } = request.params as { city: string };
  request.log.info(`Requested city: ${city}`);

  if (!city) {
    request.log.error("City parameter is missing in the request");
    throw createAppError("City parameter is missing in the request.", 400);
  }

  // consult redis first
  request.log.info(`Checking Redis cache for city: ${city}`);
  try {
    const cachedForecast = await getCityForecast(city);
    if (cachedForecast) {
      request.log.info(`Cache HIT for city: ${city}`);
      return reply.status(200).send({
        data: cachedForecast,
        cached: true,
      });
    }
    request.log.info(`Cache MISS for city: ${city}`);
  } catch (redisError) {
    request.log.error("Redis error, continuing without cache:", redisError);
  }

  // if no forecast redis
  const url = env.API_URL.concat(`/${city}?key=${env.API_KEY}`);
  request.log.info(`Making API request to external service for city: ${city}`);

  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    request.log.error(
      `External API error for city ${city}: ${response.status} - ${errorText}`
    );
    throw createAppError(
      `Error to search forecast data: ${errorText}`,
      response.status
    );
  }

  request.log.info(`External API response successful for city: ${city}`);
  const rawData = (await response.json()) as RawDataFormat;
  request.log.info(`Processing and formatting data for city: ${city}`);

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

  request.log.info(`Saving formatted data to Redis cache for city: ${city}`);
  try {
    await setCityForecast(city, formattedData);
    request.log.info(`Successfully cached forecast for city: ${city}`);
  } catch (cacheError) {
    request.log.error(`Error caching forecast for city ${city}:`, cacheError);
  }

  request.log.info(`Sending response for city: ${city} (from external API)`);
  request.log.info("=== GET FORECAST REQUEST COMPLETED ===");

  reply.status(200).send({
    data: formattedData,
    cached: false,
  });
};
