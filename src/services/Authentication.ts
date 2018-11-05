import { Request, Response, json, NextFunction, IRoute } from "express";
import { ServiceResponse } from '../models/ServiceResponse';
import jwt from 'jsonwebtoken';
import UserModel from "./users/UserModel";

export class Authentication {
    public static verifyUserToken(req: Request, res: Response, next: NextFunction) {
        const token: string = req.query.token || req.headers['x-access-token'];

        if (typeof token !== 'undefined') {
            jwt.verify(token, 'secretkey', (err: any, decodedToken: any) => {
                if (err) {
                    return res.status(403).json(new ServiceResponse(false, 403, 'Unauthorized request!'));
                } else if (decodedToken) {
                    req.params.decodedToken = decodedToken;
                    req.params.token = token;
                }
            });
            return next();
        } else {
            return res.status(403).json(new ServiceResponse(false, 403, 'Token is not valid!'));
        }
    }

    public static verifyAdminToken(req: Request, res: Response, next: NextFunction) {
        const token: string = req.query.token || req.headers['x-access-token'];
        UserModel.findById(req.params.userId)
            .then((foundUser: any) => {
                if (foundUser.role === 'admin') {
                    if (typeof token !== 'undefined') {
                        jwt.verify(token, 'secretkey', (err: any, decodedToken: any) => {
                            if (err) {
                                return res.status(403).json(new ServiceResponse(false, 403, 'Unauthorized request!'));
                            } else if (decodedToken) {
                                req.params.decodedToken = decodedToken;
                                req.params.token = token;
                            }
                        });
                        return next();
                    } else {
                        return res.status(403).json(new ServiceResponse(false, 403, 'Token is not valid!'));
                    }
                } else {
                    return res.status(403).json(new ServiceResponse(false, 403, 'User is not eligible to create admin user!'));
                }
            })
            .catch(error => {
                return res.status(403).json(new ServiceResponse(false, 500, 'Db internam error occured!'));
            });
    }
}