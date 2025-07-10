import { env } from "@/config/env";
import { app } from "@/lib/fastify";

app.listen({ port: env?.PORT }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
