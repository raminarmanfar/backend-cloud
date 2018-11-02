import { ServiceResponse } from "../../models/ServiceResponse";
import { Promise } from 'mongoose';
import jwt from 'jsonwebtoken';
import UserModel from "./UserModel";
import { resolve } from "path";
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
                                reject(new ServiceResponse(false, 200, 'Error on token generation.', err));
                            } else {
                                resolve(new ServiceResponse(true, 200, 'Token generated successfully.', { userInfo: doc, token }));
                            }
                        });
                    } else {
                        reject(new ServiceResponse(false, 200, 'Invalid credentials entered.'));
                    }
                } else {
                    reject(new ServiceResponse(false, 200, 'User not found.'));
                }
            });
            promise.catch(err => reject(new ServiceResponse(false, 500, 'internal error occured.', err)));
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
            UserModel.findOne({ username: decodedToken.user.usernameOrEmail })
            .then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'Current user information fetched.', userInfo));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal error occured.', error));
            });
        });
    }

    public getByUsername(username: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOne({ username }).then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'User information fetched.', userInfo));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal error occured.', error));
            });
        });
    }

    public getIsAvailable(filedName: string, value: string): Promise<ServiceResponse> {
        let searchObj: any = { username: value };
        if (filedName === 'email') searchObj = { email: value };

        return new Promise((resolve: any, reject: any) => {
            UserModel.findOne(searchObj).countDocuments().then((count: number) => {
                if (count === 0)
                    resolve(new ServiceResponse(true, 200, filedName + ' is Available.', { isAvailable: true }));
                else
                    resolve(new ServiceResponse(true, 200, filedName + ' exists.', { isAvailable: false }));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, filedName + 'Internal error occured.', error));
            });
        });
    }

    public changePassword(username: string, currentPassword: string, newPassword: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOne({ username: username }).then((result: any) => {
                if (!result.isValid(currentPassword)) {
                    resolve(new ServiceResponse(false, 200, 'Password is NOT valid.', { isPassValid: false }));
                } else {
                    UserModel.findOneAndUpdate({ username: username }, { password: UserModels.hashPassword(newPassword), }).then((result: any) => {
                        resolve(new ServiceResponse(true, 200, 'Password has been changed successfully.', { isPassValid: true, result }));
                    }).catch(error => {
                        reject(new ServiceResponse(false, 500, 'Internal error occured.', error));
                    });
                }
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
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public updateByUsername(username: string, newData: any): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndUpdate({ username }, newData).then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'User info has been updated successfully.', userInfo));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public updateCurrentUser(decodedToken: any, token: string, newData: any): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndUpdate({ username: decodedToken.user.usernameOrEmail }, newData).then((userInfo: any) => {
                UserModel.findById(userInfo._id).then(updatedUserInfo => {
                    const dataToSend = { userInfo: updatedUserInfo, token };
                    console.log(dataToSend);
                    resolve(new ServiceResponse(true, 200, 'Current user info has been updated successfully.', dataToSend));
                });
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public deleteAll(): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.deleteMany({}).then(() => {
                resolve(new ServiceResponse(true, 204, 'All users have been deleted successfully.'));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public deleteByUsername(username: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndRemove({ username }).then(() => {
                resolve(new ServiceResponse(true, 204, 'User info has been deleted successfully.'));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }
}