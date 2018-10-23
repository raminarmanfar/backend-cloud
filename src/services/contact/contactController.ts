import ContactModel from "./contactModel";
import { ServiceResponse } from '../../models/ServiceResponse';

export default class ContactController {       
    public getAll(cb: any) {
        ContactModel.find().then((data) => {
            cb(200, data);
        }).catch((error) => {
            cb(500, error);
        });
    }

    public getByContactId(id: string, cb: any) {
        ContactModel.findById(id).then((data) => {
            cb(200, data);
        }).catch((error) => {
            cb(500, error);
        });
    }

    public create(data: any, cb: any) {
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
            const respSuccess: ServiceResponse = new ServiceResponse(true, 'Contact message sent successfully.', data);
            cb(201, respSuccess);
        }).catch((error) => {
            const respError: ServiceResponse = new ServiceResponse(false, 'Error Occured while submitting your contact message.', error);
            cb(500, respError);
        });
    }

    public update(id: string, newData: any,  cb: any) {
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