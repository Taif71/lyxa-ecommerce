import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ReplaceAuthorizationHeaderFromCookie implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.cookies && req.cookies.authorization) {
      req.headers.authorization = req.cookies.authorization;
    }
    next();
  }
}