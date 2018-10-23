import { Request, Response, Router } from 'express';
import ContactController from './contactController';

export default class ContactRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.setRoutes();
    }

    // set up our routes
    public setRoutes() {
        this.router.get('/', this.getAllContacts);
        this.router.get('/:id', this.getContactByContactId);
        this.router.post('/', this.create);
        this.router.put('/:id', this.update);
        this.router.delete('/:id', this.delete);
    }

    public getAllContacts(req: Request, res: Response): void {
        new ContactController().getAll().then(result => res.status(result.responseCode).json(result));
    }

    public getContactByContactId(req: Request, res: Response): void {
        new ContactController().getByContactId(req.params.id).then(result => res.status(result.responseCode).json(result));
    }

    public create(req: Request, res: Response): void {
        new ContactController().create(req.body).then(result => res.status(result.responseCode).json(result));
    }

    public update(req: Request, res: Response): void {
        new ContactController().update(req.params.id, req.body, (status: number, data: any) => res.status(status).json(data));
    }

    public delete(req: Request, res: Response): void {
        new ContactController().delete(req.params.id, (error: any) => {
            if(error) {
                res.status(500).json(error);
            } else {
                res.status(204).end();
            }
        });
    }
}