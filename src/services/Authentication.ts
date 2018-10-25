import { Request, Response, json, NextFunction, IRoute } from "express";
import { UserRoleEnum } from '../models/enums/UserRoleEnum';
import { ServiceResponse } from '../models/ServiceResponse';
import { Promise } from 'mongoose';

export class Authentication {
    public static verifyUserToken(req: Request, res: Response, next: NextFunction) {
        const bearerHeader: string = req.query.token || req.headers['x-access-token'];

        if(typeof bearerHeader !== 'undefined') {
            req.params.token = bearerHeader;
            return next();
        } else {
            return res.status(403).json(new ServiceResponse(false, 403, 'Token is not valid!'));
        }

        /**
        Authentication.getUserByToken(req)
            .then(user => {
                if (user.role == UserRoleEnum.Admin) return next();
                else return res.send(new ServiceResponse(false, 403, 'No admin access privileges.'));
            })
            .catch(error => {
                return res.send(new ServiceResponse(false, 500, error));
            })
        /**/
        

        /*
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {

        } else {
            res.status(403);
        }
        */
        next();
    }

    /**
    public static getUserByToken(req: Request): Promise<any> {
        let token = req.query.token || req.headers['x-access-token'];
        if (token) {
            const findUserQuery = User.findOne({ accessToken: token });
            const findUserExec = findUserQuery.exec();
            return findUserExec
                .then((user: any) => {
                    if (user) return Promise.resolve(user);
                    else return Promise.reject('No user found with that token.');
                })
                .catch((error: any) => {
                    return Promise.reject('No user found with that token.');
                });
        }
        else return Promise.reject('No token provided.');
    }
    /**/
}