import { UserRoleEnum } from '../../models/enums/UserRoleEnum';
import { ServiceResponse } from '../../models/ServiceResponse';
import { Promise } from 'mongoose';
import jwt from 'jsonwebtoken';
import UserModel from "./UserModel";
import * as FileOperations from '../../FileOperations';
import config from "../../config";
const UserModels = require('./UserModel');
import rimraf from 'rimraf';

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
        if (filedName === 'username' && value === 'rootadmin') {
            return new Promise((resolve: any) => {
                resolve(new ServiceResponse(false, 200, filedName + ' not allowed to be used.', { isAvailable: false }));
            });
        } else {
            let searchObj: any = filedName === 'username' ? { username: value } : { email: value };
            return new Promise((resolve: any, reject: any) => {
                UserModel.findOne(searchObj).countDocuments().then((count: number) => {
                    if (count === 0)
                        resolve(new ServiceResponse(true, 200, filedName + ' is Available.', { isAvailable: true }));
                    else
                        resolve(new ServiceResponse(false, 200, filedName + ' is already exists.', { isAvailable: false }));
                }).catch((error: any) => {
                    reject(new ServiceResponse(false, 500, filedName + 'Internal error occured.', error));
                });
            });
        }
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

    private createUser(userInfo: any, file: any, role: string): Promise<ServiceResponse> {
        const imageName: string = file ? file.filename : config.defaultProfileImage.imageName;
        const userModel = new UserModel({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phone: userInfo.phone,
            username: userInfo.username,
            password: UserModels.hashPassword(userInfo.password),
            role: role,
            imageUrl: config.services.users + '/image/' + imageName
        });

        return new Promise((resolve: any, reject: any) => {
            userModel.save().then((userInfo: any) => {
                resolve(new ServiceResponse(true, 200, 'New user has been registered successfully.', userModel));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public createAdminUser(userInfo: any, file: any): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            this.createUser(userInfo, file, 'admin')
                .then((result: ServiceResponse) => resolve(new ServiceResponse(true, 200, 'New user has been registered successfully.', result.data)))
                .catch((error: ServiceResponse) => reject(new ServiceResponse(false, 500, 'Internal Error occured.', error)));
        });
    }

    public createOrdinaryUser(userInfo: any, file: any): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            this.createUser(userInfo, file, 'user')
                .then((result: ServiceResponse) => resolve(result))
                .catch((error: ServiceResponse) => reject(error));
        });
    }

    public updateByUsername(username: string, token: string, newData: any, file: any): Promise<ServiceResponse> {
        const oldImageUrl = newData.oldImageUrl.lenght > 0 ? newData.oldImageUrl : 'defaultUser.png';
        const imageName: string = file ? file.filename : oldImageUrl;
        const userModel = {
            firstName: newData.firstName,
            lastName: newData.lastName,
            email: newData.email,
            phone: newData.phone,
            username: newData.username,
            imageUrl: config.services.users + '/image/' + imageName
        };

        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndUpdate({ username }, userModel).then((userInfo: any) => {
                UserModel.findById(userInfo._id).then(updatedUserInfo => {
                    const dataToSend = { userInfo: updatedUserInfo, token };
                    resolve(new ServiceResponse(true, 200, 'Current user info has been updated successfully.', dataToSend));
                });
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public updateCurrentUser(decodedToken: any, token: string, newData: any, file: any): Promise<ServiceResponse> {
        const oldImageUrl = newData.oldImageUrl.lenght > 0 ? newData.oldImageUrl : 'defaultUser.png';
        const imageName: string = file ? file.filename : oldImageUrl;
        const userModel = {
            firstName: newData.firstName,
            lastName: newData.lastName,
            email: newData.email,
            phone: newData.phone,
            username: newData.username,
            imageUrl: config.services.users + '/image/' + imageName
        };

        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndUpdate({ username: decodedToken.user.usernameOrEmail }, userModel).then((userInfo: any) => {
                UserModel.findById(userInfo._id).then(updatedUserInfo => {
                    const dataToSend = { userInfo: updatedUserInfo, token };
                    resolve(new ServiceResponse(true, 200, 'Current user info has been updated successfully.', dataToSend));
                });
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public deleteAll(): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.deleteMany({ role: { $ne: 'admin' } }).then(() => {
                rimraf(config.files.usersProfileImagesPath + '*', () => {
                    resolve(new ServiceResponse(true, 204, 'All users have been deleted successfully.'));
                });
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public deleteByUsername(username: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndRemove({ username }).then((result: any) => {
                let imageName: string = result.imageUrl;
                imageName = imageName.substring(imageName.lastIndexOf('/') + 1);
                FileOperations.deleteFile(config.files.usersProfileImagesPath + imageName).then(() => {
                    resolve(new ServiceResponse(true, 204, 'User info has been deleted successfully.'));
                })
                    .catch(error => {
                        reject(new ServiceResponse(false, 500, error.message, error));
                    });
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public uploadImage(username: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            UserModel.findOneAndRemove({ username }).then(() => {
                resolve(new ServiceResponse(true, 204, 'User info has been deleted successfully.'));
            }).catch((error: any) => {
                reject(new ServiceResponse(false, 500, 'Internal Error occured.', error));
            });
        });
    }

    public provideImage(imageName: string): Promise<ServiceResponse> {
        return new Promise((resolve: any, reject: any) => {
            const imageUrl = (imageName === config.defaultProfileImage.imageName ? config.defaultProfileImage.path : config.files.usersProfileImagesPath) + imageName;
            //Check first if the image exist
            FileOperations.fileStat(imageUrl)
                .then(data => resolve(new ServiceResponse(true, 200, 'Image fetched.', { data, imageUrl })))
                .catch(error => reject(new ServiceResponse(false, 500, 'No image found.', error)));
        });
    }

}