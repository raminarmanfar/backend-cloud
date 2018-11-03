import { Request, Response, Router } from 'express';
import UserController from './UserController';
import { Authentication } from '../Authentication';
import multer from 'multer';
import config from '../../config';

// const uploadMicroservicesImages = multer({ dest: `${config.fileStorage.usersProfileImageUrl}` });
export default class UserRouter {
    public router: Router;
    /*
    private storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/profilePhotos')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
    private upload: multer.Instance = multer({ storage: this.storage });
    */
    
    constructor(private uploader: multer.Instance) {
        this.router = Router();
        this.setRoutes();
    }

    // set up our routes
    public setRoutes() {
        this.router.post('/login', this.login);
        this.router.get('/all', Authentication.verifyUserToken, this.getAllUsers);
        this.router.get('/current', Authentication.verifyUserToken, this.getCurrentUser);
        this.router.get('/:username', Authentication.verifyUserToken, this.getUserByUsername);
        this.router.get('/available/:fieldName/:value', this.getIsAvailable);
        this.router.post('/change-password', Authentication.verifyUserToken, this.changePassword);
        this.router.post('/', this.uploader.single('photo'), this.create);
        this.router.put('/current', Authentication.verifyUserToken, this.updateCurrentUser);
        this.router.put('/:username', Authentication.verifyUserToken, this.updateByUsername);
        this.router.delete('/all', Authentication.verifyUserToken, this.deleteAll);
        this.router.delete('/:username', Authentication.verifyUserToken, this.deleteByUsername);

        // this.router.post('/upload-image', this.upload.single('photo'), Authentication.verifyUserToken, this.uploadImage);
        this.router.post('/upload-image', this.uploader.single('photo'), this.uploadImage);
    }

    public login(req: Request, res: Response): void {
        new UserController().login(req.body)
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

    public getIsAvailable(req: Request, res: Response): void {
        new UserController().getIsAvailable(req.params.fieldName, req.params.value)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public changePassword(req: Request, res: Response): void {
        new UserController().changePassword(req.body.username, req.body.currentPassword, req.body.newPassword)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public create(req: Request, res: Response): void {
        new UserController().create(req.body, req.file)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public updateCurrentUser(req: Request, res: Response): void {
        new UserController().updateCurrentUser(req.params.decodedToken, req.params.token, req.body)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public updateByUsername(req: Request, res: Response): void {
        new UserController().updateByUsername(req.params.username, req.body.newInfo)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public deleteAll(req: Request, res: Response): void {
        new UserController().deleteAll()
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public deleteByUsername(req: Request, res: Response): void {
        new UserController().deleteByUsername(req.params.username)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }

    public uploadImage(req: Request, res: Response): void {
        new UserController().uploadImage(req.params.username)
            .then(result => res.status(result.statusCode).json(result))
            .catch(error => res.status(error.statusCode).json(error));
    }
}