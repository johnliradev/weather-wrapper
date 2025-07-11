import "dotenv/config";
import z, { treeifyError } from "zod";

const _env = z.object({
  PORT: z
    .string()
    .min(1, ".env is invalid: PORT is not provided")
    .transform(Number),
  API_KEY: z.string().min(1, ".env is invalid: API_KEY is not provided"),
  API_URL: z.string().min(1, ".env is invalid: API_URL is not provided"),
});

function validateEnv() {
  const _parsed = _env.safeParse(process.env);
  if (!_parsed.success) {
    console.error(
      "Invalid environment variables",
      treeifyError(_parsed.error).properties
    );
    throw new Error("Invalid environment variables");
  }
  return _parsed.data;
}
export const env = validateEnv();
