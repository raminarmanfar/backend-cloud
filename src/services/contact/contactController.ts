import ContactModel from "./contactModel";
import { ServiceResponse } from '../../models/ServiceResponse';
import { Promise } from "mongoose";

export default class ContactController {
    public getAll(): Promise<ServiceResponse> {
        return new Promise((resolve: any) => {
            ContactModel.find().then((data) => {
                resolve(new ServiceResponse(true, 200, 'All recoreds returned.', data));
            }).catch((error) => {
                resolve(new ServiceResponse(false, 500, 'Error occured during fetch all records.', error));
            });
        });
    }

    public getByContactId(id: string): Promise<ServiceResponse> {
        return new Promise((resolve: any) => {
            ContactModel.findById(id).then((data) => {
                resolve(new ServiceResponse(true, 200, 'Requested recored returned.', data));
            }).catch((error) => {
                resolve(new ServiceResponse(false, 500, 'Error occured during fetch requested record.', error));
            });
        });
    }

    public create(data: any): Promise<ServiceResponse> {
        return new Promise((resolve: any) => {
            const firstName: string = data.firstName;
            const lastName: string = data.lastName;
            const email: string = data.email;
            const subject: string = data.subject;

            const contactModel = new ContactModel({
                firstName,
                lastName,
                email,
                subject
            });

            contactModel.save().then((data) => {
                const respSuccess: ServiceResponse = new ServiceResponse(true, 201, 'Contact message sent successfully.', data);
                resolve(respSuccess);
            }).catch((error) => {
                const respError: ServiceResponse = new ServiceResponse(false, 500, 'Error Occured while submitting your contact message.', error);
                resolve(respError);
            });
        });
    }

    public update(id: string, newData: any, cb: any) {
        ContactModel.findByIdAndUpdate(id, newData).then((data) => {
            cb(200, data);
        }).catch((error) => {
            cb(500, error);
        });
    }

    public delete(id: string, cb: any) {
        ContactModel.findByIdAndDelete(id).then(() => {
            cb(null);
        }).catch((error) => {
            cb(error);
        });
    }
}