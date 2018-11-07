import * as bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import logger from 'morgan';
import crypto from 'crypto';
// import bcrypt from 'bcrypt';

// import configs
import config from './config';
// import routers
import MenuRouter from './services/menu/MenuRouter';
import UserRouter from './services/users/UserRouter';
import PostRouter from './services/posts/PostRouter';
import ContactRouter from './services/contact/contactRouter';

import multer from 'multer';
import * as path from 'path';

export default class Server {
  // set app to be of type express.Application
  public app: express.Application;

  /**/
  private storage = multer.diskStorage({
    destination: (req: Express.Request, file: Express.Multer.File, cb: any) => {
      cb(null, config.fileStorage.usersProfileImageUrl);
    },
    filename: (req: Express.Request, file: Express.Multer.File, cb: any) => {
      crypto.randomBytes(16, (err: any, raw: any) => {
        cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
      });
    }
  });
  private uploader = multer({ storage: this.storage });
  /**/

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  // application config
  public config(): void {

    // set up mongoose
    // mongoose.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true });
    //mongoose.connect(config.mongo.url, { useNewUrlParser: true });

    // express middleware
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(logger('dev'));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }

  // application routes
  public routes(): void {
    const router: express.Router = express.Router();

    this.app.use('/', router);
    this.app.use(config.services.menus, new MenuRouter(this.uploader).router);
    this.app.use(config.services.users, new UserRouter(this.uploader).router);
    this.app.use(config.services.posts, new PostRouter().router);
    this.app.use(config.services.contacts, new ContactRouter().router);
  }

  public start() {
    const MONGO_URI = `mongodb://${config.mongoDB.url}:${config.mongoDB.port}/${config.mongoDB.dbName}`;
    console.log('MONGODB URL: ', MONGO_URI);

    // Connect to mongoDB
    (mongoose as any).Promise = global.Promise;
    mongoose.set('useCreateIndex', true);
    if (config.mongoDB.user && config.mongoDB.password) {
      console.log("Authentication should be enabled.");
      mongoose.connect(MONGO_URI, { user: config.mongoDB.user, pass: config.mongoDB.password, useNewUrlParser: true });
    } else {
      console.log("Authentication should be disabled.");
      mongoose.connect(MONGO_URI, { useNewUrlParser: true });
    }

    //on connection success
    mongoose.connection.on('connected', () => {
      console.log('Connected to database ' + MONGO_URI + '...');
    });
    //On database connection error
    mongoose.connection.on('error', (err) => {
      console.log('Database connection error: ' + err);
    });

    this.app.listen(config.http.port, () => console.log(`Server started on port ${config.http.port}!`));
  }
}

