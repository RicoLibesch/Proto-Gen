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



  /**
 * Middleware function to verify the access token in the Authorization header.
 * @function
 * @name verifyAccessToken
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void} The function does not return a value, but it may send responses or call the next middleware.
 */
export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    /**
   * The Authorization header containing the access token.
   * @type {string}
   */
    const authHeader: string = req.headers['authorization'];
      /**
   * The access token extracted from the Authorization header.
   * @type {string}
   */
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







/**
 * Middleware function to check if the user has the role of an administrator.
 * @function
 * @name isAdmin
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void} The function does not return a value, but it may send a response or call the next middleware.
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if(await hasRole(req.user.id, 1)) {
    next();
  } else {
    return res.status(403).json({message: 'Unauthorized'});
  }
};

/**
 * Middleware function to check if the user has the role of a recorder.
 * @function
 * @name isRecorder
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void} The function does not return a value, but it may send a response or call the next middleware.
 */

export const isRecorder = async (req: Request, res: Response, next: NextFunction) => {
  if(await hasRole(req.user.id, 2)) {
    next();
  } else {
    return res.status(403).json({message: 'Unauthorized'});
  }
};

/**
 * Middleware function to check if the user has the role of an administrator or a recorder.
 * @function
 * @name isAdminOrRecorder
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void} The function does not return a value, but it may send a response or call the next middleware.
 */
export const isAdminOrRecorder = async (req: Request, res: Response, next: NextFunction) => {
  if(await hasRole(req.user.id, 1) || await hasRole(req.user.id, 2)) {
    next();
  } else {
    return res.status(403).json({message: 'Unauthorized'});
  }
};