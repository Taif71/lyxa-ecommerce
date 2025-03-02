import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token);
        req.user = {
          _id: decoded._id,
          email: decoded.email,
          isAdmin: decoded.isAdmin,
          isSuperAdmin: decoded.isSuperAdmin,
        };
      } catch (err) {
        // If token verification fails, just proceed without attaching user
      }
    }
    next();
  }
}
