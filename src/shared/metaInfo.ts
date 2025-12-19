import { type Request } from "express"

export function metaFrom(req: Request) {
  return {
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  }
}