import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../models/userModel'

declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
    const authHeader: string = req.headers['authorization'];
    const token: string = authHeader && authHeader.split(' ')[1];
    if(token == null) 
        return res.status(401).send({message: 'No Auth Token provided'});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            if(err instanceof TokenExpiredError)
                return res.status(401).send({message: 'Auth Token expired'});
            return res.status(403).json({message: 'Invalid Auth Token'});
        }
        req.user = user;
        next();
    });
}