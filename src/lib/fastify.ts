import fastify from "fastify";
import { registerPlugins } from "./plugins";
import { errorHandler } from "@/http/errors/error-handler";

export const app = fastify({ logger: true });
app.setErrorHandler(errorHandler);
registerPlugins(app);
