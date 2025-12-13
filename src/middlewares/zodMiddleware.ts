import { z } from "zod";
import { type NextFunction, type Request, type Response } from 'express';
export const validate = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validated = schema.parse(req.body);
      next();
    } catch (err) {
      if(err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Validation failed",
            details: err.issues,
            code: 400
          },
          meta: {
            path: req.path,
            timestamp: new Date().toISOString()
          }
        });
      }
    }
  };