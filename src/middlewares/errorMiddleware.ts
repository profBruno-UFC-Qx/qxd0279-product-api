import { type NextFunction, type Request, type Response } from 'express';
export const handlerError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
      details: [],
      code: "INTERNAL_ERROR"
    },
    meta: {
      path: req.path,
      timestamp: new Date().toISOString()
    }
  });
}