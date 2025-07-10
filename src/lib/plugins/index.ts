import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { Router } from "@/http/routes/index";

export const registerPlugins = (app: FastifyInstance) => {
  app.register(cors, { origin: "*" });
  app.register(swagger, {
    swagger: {
      info: {
        title: "API Documentation",
        description: "API documentation",
        version: "1.0.0",
      },
      host: "localhost:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });
  app.register(swaggerUi, {
    routePrefix: "/api/docs",
    uiConfig: {
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
  app.register(Router, { prefix: "/api" });
};
