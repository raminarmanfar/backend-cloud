import { ServiceResponse } from "../../models/ServiceResponse";
import { Promise } from 'mongoose';
import jwt from 'jsonwebtoken';
import UserModel from "./UserModel";
const UserModels = require("./UserModel");

export default class UserController {
    public login(user: any): Promise<ServiceResponse> {
        let promise = UserModel.findOne({ $or: [{ email: user.usernameOrEmail }, { username: user.usernameOrEmail }] }).exec();

        return new Promise((resolve: any, reject: any) => {
            promise.then((doc: any) => {
                if (doc) {
                    if (doc.isValid(user.password)) {
                        jwt.sign({ user }, 'secretkey', (err: any, token: any) => {
                            if (err) {
                                reject(new ServiceResponse(false, 500, 'Error on token generation.', err));
                            } else {
                                resolve(new ServiceResponse(true, 200, 'Token generated successfully.', { token }));
                            }
                        });
                    } else {
                        reject(new ServiceResponse(false, 501, 'Invalid credentials entered.'));
                    }
                } else {
                    reject(new ServiceResponse(false, 501, 'User not found.'));
                }
            });
            promise.catch(err => reject(new ServiceResponse(false, 501, 'internal error occured.', err)));
        });
    }

    public getAll(): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.find()
                .then((userData: any) => {
                    resolve(new ServiceResponse(true, 200, 'All users records fetched.', userData));
                })
                .catch((error: any) => {
                    reject(new ServiceResponse(false, 500, 'Error occured while fetching all users records.', error));
                });
        });
    }

    public getCurrentUser(decodedToken: any): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOne({ username: decodedToken.user.usernameOrEmail }).then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'Current user information fetched.', userInfo));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal error occured whily fetching current user data.', error));
            });
        });
    }

    public getByUsername(username: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOne({ username }).then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'User information fetched.', userInfo));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal error occured whily fetching user data.', error));
            });
        });
    }

    public create(userInfo: any): Promise<ServiceResponse> {
        const userModel = new UserModel({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phone: userInfo.phone,
            username: userInfo.username,
            password: UserModels.hashPassword(userInfo.password),
            role: userInfo.role
        });

        return new Promise((resolve: any, reject: any) => {
            userModel.save().then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'New user has been registered successfully.', userInfo));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Error occured while registering new user.', error));
            });
        });
    }

    public updateByUsername(username: string, newData: any): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndUpdate({ username }, newData).then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'User info has been updated successfully.', userInfo));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Error occured while updating the user info.', error));
            });
        });
    }    
    
    public updateCurrentUser(decodedToken: any, newData: any): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndUpdate({ username: decodedToken.user.usernameOrEmail }, newData).then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'Current user info has been updated successfully.', userInfo));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Error occured while updating current user info.', error));
            });
        });
    }

    public delete(username: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndRemove({ username }).then(() => {
                resolve(new ServiceResponse(true, 204, 'User info has been deleted successfully.'));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Error occured while deleting the user info.', error));
            });
        });
    }
}