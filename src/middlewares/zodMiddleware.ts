import { z } from "zod";
import { type NextFunction, type Request, type Response } from "express";
import { metaFrom } from "../shared/metaInfo.js";

export const validateBody =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: zodErrorToResponse(err, "VALIDATION ERROR"),
          meta: metaFrom(req),
        });
      }
    }
  };

export const validateParams =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.params = schema.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: zodErrorToResponse(err, "VALIDATION ERROR"),
          meta: metaFrom(req),
        });
      }
    }
  };

export const validateQuery =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.query = schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: zodErrorToResponse(err, "VALIDATION ERROR"),
          meta: metaFrom(req),
        });
      }
    }
  };


function zodErrorToResponse(err: z.ZodError, code: string) {
  return {
    error: {
      message: "Validation failed",
      details: err.issues.map((issue) => ({
        field: issue.path.length == 1 ? issue.path[0] : issue.path,
        message: issue.message,
      })),
      code,
    },
  };
}
