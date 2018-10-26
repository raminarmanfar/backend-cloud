import { Request, Response, Router } from 'express';
import UserController from './UserController';
import { Authentication } from '../Authentication';

export default class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.setRoutes();
    }

    // set up our routes
    public setRoutes() {
        this.router.post('/login', this.login);
        this.router.get('/all', Authentication.verifyUserToken, this.getAllUsers);
        this.router.get('/current', Authentication.verifyUserToken, this.getCurrentUser);
        this.router.get('/:username', Authentication.verifyUserToken, this.getUserByUsername);
        this.router.post('/', this.create);
        this.router.put('/current', Authentication.verifyUserToken, this.updateCurrentUser);
        this.router.put('/:username', Authentication.verifyUserToken, this.updateByUsername);
        this.router.delete('/:username', Authentication.verifyUserToken, this.delete);
    }

    public login(req: Request, res: Response): void {
        new UserController().login(req.body.user)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public getAllUsers(req: Request, res: Response): void {
        new UserController().getAll()
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public getCurrentUser(req: Request, res: Response): void {
        new UserController().getCurrentUser(req.params.decodedToken)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public getUserByUsername(req: Request, res: Response): void {
        new UserController().getByUsername(req.params.username)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public create(req: Request, res: Response): void {
        new UserController().create(req.body.userInfo)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public updateCurrentUser(req: Request, res: Response): void {
        new UserController().updateCurrentUser(req.params.decodedToken, req.body.newInfo)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public updateByUsername(req: Request, res: Response): void {
        new UserController().updateByUsername(req.params.username, req.body.newInfo)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public delete(req: Request, res: Response): void {
        new UserController().delete(req.params.username)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }
}