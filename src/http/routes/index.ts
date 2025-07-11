import { getForecast } from "@/functions/get-forecast";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const Router = (app: FastifyInstance) => {
  app.get(
    "/weather/:city",
    {
      schema: {
        description: "Get weather forecast for a city",
        tags: ["Weather"],
        params: {
          type: "object",
          properties: {
            city: { type: "string", description: "City name" },
          },
          required: ["city"],
        },
        response: {
          200: {
            description: "Successful response with weather forecast data",
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  info: {
                    type: "object",
                    properties: {
                      city: { type: "string" },
                      state: { type: "string" },
                      country: { type: "string" },
                    },
                    required: ["city", "state", "country"],
                  },
                  currentConditions: {
                    type: "object",
                    properties: {
                      currentTemperatureCelsius: { type: "number" },
                      currentTemperatureFahrentheit: { type: "number" },
                      feelsLikeCelsius: { type: "number" },
                      feelsLikeFahrentheit: { type: "number" },
                      humidity: { type: "number" },
                      conditions: { type: "string" },
                    },
                    required: [
                      "currentTemperatureCelsius",
                      "currentTemperatureFahrentheit",
                      "feelsLikeCelsius",
                      "feelsLikeFahrentheit",
                      "humidity",
                      "conditions",
                    ],
                  },
                  dailyForecast: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string", format: "date" },
                        tempMaxCelsius: { type: "number" },
                        tempMinCelsius: { type: "number" },
                        tempMax: { type: "number" },
                        tempMin: { type: "number" },
                        condition: { type: "string" },
                        chanceRainPercentual: { type: "number" },
                      },
                      required: [
                        "date",
                        "tempMaxCelsius",
                        "tempMinCelsius",
                        "tempMax",
                        "tempMin",
                        "condition",
                        "chanceRainPercentual",
                      ],
                    },
                  },
                },
                required: ["info", "currentConditions", "dailyForecast"],
              },
            },
            required: ["data"],
          },
        },
      },
    },
    getForecast
  );
  // Routes tests
  app.get(
    "/ping",
    { schema: { tags: ["test"] } },
    (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ res: "pong" });
    }
  );
  app.get(
    "/test-error",
    { schema: { tags: ["test"] } },
    (request: FastifyRequest, reply: FastifyReply) => {
      const { createAppError } = require("../errors/appError");
      throw createAppError("Unauthorized", 401);
    }
  );
};
