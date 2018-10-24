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
                resolve(new ServiceResponse(true, 201, 'Contact message sent successfully.', data));
            }).catch((error) => {
                resolve(new ServiceResponse(false, 500, 'Error Occured while submitting your contact message.', error));
            });
        });
    }

    public update(id: string, newData: any): Promise<ServiceResponse> {
        return new Promise((resolve: any) => {
            ContactModel.findByIdAndUpdate(id, newData).then((data) => {
                resolve(new ServiceResponse(true, 200, 'Requested record has been updated successfully.', data));
            }).catch((error) => {
                resolve(new ServiceResponse(false, 500, 'Error occured while trying to update the requested record.', error));
            });
        });
    }

    public delete(id: string): Promise<ServiceResponse> {
        return new Promise((resolve: any) => {
            ContactModel.findByIdAndDelete(id).then(() => {
                resolve(new ServiceResponse(true, 200, 'Requested record has been deleted successfully.', null));
            }).catch((error) => {
                resolve(new ServiceResponse(false, 500, 'Error occured while trying to delete the requested record.', error));
            });
        });
    }
}
