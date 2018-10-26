import { Request, Response, json, NextFunction, IRoute } from "express";
import { ServiceResponse } from '../models/ServiceResponse';
import { Promise } from 'mongoose';
import jwt from 'jsonwebtoken';

export class Authentication {
    public static verifyUserToken(req: Request, res: Response, next: NextFunction) {
        const token: string = req.query.token || req.headers['x-access-token'];

        if(typeof token !== 'undefined') {
            jwt.verify(token, 'secretkey', (err: any, decodedToken: any) => {
                if (err) {
                    return res.status(403).json(new ServiceResponse(false, 403, 'Unauthorized request!'));
                } else if(decodedToken) {
                    req.params.decodedToken = decodedToken;
                }
            });
            return next();
        } else {
            return res.status(403).json(new ServiceResponse(false, 403, 'Token is not valid!'));
        }
    }
}