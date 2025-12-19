import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();


export function buildOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const doc = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Products API',
      description: 'API for managing products',
    },
    servers: [{ url: 'http://localhost:3000' }],
  })
  return doc;
}