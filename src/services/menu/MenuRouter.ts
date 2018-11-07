import { Request, Response, Router } from 'express';
import MenuController from './MenuController';
import multer from 'multer';

export default class MenuRouter {
    public router: Router;

    constructor(private uploader: multer.Instance) {
        this.router = Router();
        this.setRoutes();
    }

    // set up our routes
    public setRoutes() {
        this.router.get('/', this.getAllMenus);
    }

    public getAllMenus(req: Request, res: Response): void {
        new MenuController().getAll()
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }
}