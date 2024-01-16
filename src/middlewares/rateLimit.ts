import rateLimit from 'express-rate-limit';
import express, { Request, Response, NextFunction } from 'express';

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1500, // 1.5 second
  max: 1, // Limit each IP to 1 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: function (req: Request, res: Response, next: NextFunction) {
    const error: any = new Error(
      // "You sent too many requests. Please wait a while then try again"
      'شما درخواست های زیادی ارسال کردید. لطفا کمی صبر کنید سپس دوباره امتحان کنید'
    );
    error.statusCode = 429;
    throw error;
  }
});

export default limiter;
