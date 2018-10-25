import UserModel from "./UserModel";
import { ServiceResponse } from "../../models/ServiceResponse";
import { Promise } from 'mongoose';
import jwt from 'jsonwebtoken';

export default class UserController {
    public login(user: any): Promise<ServiceResponse> {
        return new Promise((resolve: any) => {
            jwt.sign({ user }, 'secretkey', (err: any, token: any) => {
                if (err) {
                    resolve(new ServiceResponse(false, 500, 'Error on token generation.', err));
                } else {
                    resolve(new ServiceResponse(true, 200, 'Token generated successfully.', { token }));
                }
            });
        });
    }

    public getAll(token: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            jwt.verify(token, 'secretkey', (err: any, authData: any) => {
                if (err) {
                    console.log('(1) ===========> We are here now');
                    reject(new ServiceResponse(false, 403, 'forbiden.', err));
                } else {
                    UserModel.find()
                        .then((data) => {
                            console.log('(2) ===========> We are here now');
                            resolve(new ServiceResponse(true, 200, 'All users records fetched.', data));
                        })
                        .catch((error) => {
                            console.log('(3) ===========> We are here now');
                            reject(new ServiceResponse(false, 500, 'Error occured while fetching all users records.', error));
                        });
                }
            });
        });
    }

    public getByUsername(username: string, cb: any) {
        UserModel.findOne({ username }).then((data) => {
            cb(200, data);
        }).catch((error) => {
            cb(500, error);
        });
    }

    public create(data: any, cb: any) {
        const firstName: string = data.firstName;
        const lastName: string = data.lastName;
        const username: string = data.username;
        const email: string = data.email;
        const password: string = data.password;

        const userModel = new UserModel({
            firstName,
            lastName,
            username,
            email,
            password
        });

        userModel.save().then((data) => {
            cb(201, data);
        }).catch((error) => {
            cb(500, error);
        });
    }

    public update(username: string, newData: any, cb: any) {
        UserModel.findOneAndUpdate({ username }, newData).then((data) => {
            cb(200, data);
        }).catch((error) => {
            cb(500, error);
        });
    }

    public delete(username: string, cb: any) {
        UserModel.findOneAndRemove({ username }).then(() => {
            cb(null);
        }).catch((error) => {
            cb(error);
        });
    }
}