# Node.js API Template

A modern and robust template for Node.js APIs using Fastify, TypeScript, and Zod.

## Technologies

- **Fastify** - Fast and efficient web framework
- **TypeScript** - Static typing for JavaScript
- **Zod** - Schema validation and runtime type checking
- **Swagger/OpenAPI** - Automatic API documentation
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables management
- **tsx** - TypeScript executor for development

## Project Structure

### Aliases TypeScript

This project use aliases to ease imports:

- `@/*` → `src/*`

Example:

```typescript
import { app } from "@/lib/fastify";
import { env } from "@/config/env";
```

## ️Error Handler

### Global Error Handler

- Automatically catches unhandled errors
- Formats consistent error responses
- Logs errors for debugging

### Create Custom Errors

```typescript
import { createAppError } from "@/http/errors/error-handler";

// in your routes
throw createAppError("Error Message", 400);
```

### Comuns Status Code

- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Plugins

- **Zod**, **Swagger/OpenAPI** and **Cors**
- All plugins can be customized on `src/lib/plugins/index.ts`

## Initial Scripts

| Comando       | Descrição                     |
| ------------- | ----------------------------- |
| `npm run dev` | Init server in developer mode |

## Debugging

The project uses Fastify's logger for debugging:

- Automatic request logging
- Detailed error logging
- Colored formatting in development

## Deploy

### Docker (Recommended if you not have node 22 version)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

## Support

If you encounter any issues or have questions:

1. Check the API documentation at `/api/docs`
2. Test the health check route at `/api/ping`
3. Consult the server logs
4. Open an issue in the repository

---

**Developed with ❤️ using Fastify and TypeScript**
