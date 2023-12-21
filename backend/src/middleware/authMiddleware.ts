import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../models/userModel';
import { hasRole } from '../services/userRoleService';

declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if(await hasRole(req.user.id, 1)) {
    next();
  } else {
    return res.status(403).json({message: 'Unauthorized'});
  }
};

export const isRecorder = async (req: Request, res: Response, next: NextFunction) => {
  if(await hasRole(req.user.id, 2)) {
    next();
  } else {
    return res.status(403).json({message: 'Unauthorized'});
  }
};