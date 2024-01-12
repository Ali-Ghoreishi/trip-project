import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as fs from 'fs';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
const xss = require('xss-clean');
import morgan from 'morgan';
import path from 'path';
require('./components/language/index');
import localizify, { t as localizifyT } from 'localizify';
import { connectDB } from './db/config/connection';
// import { cronJobFunc } from './components/cronJobs';

//* Configs
dotenv.config();

//* database connection
connectDB();

const app: Application = express();

//* get exac ip in production server (becaus we use reverse proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

//* Streaming logs to file
const logStream = fs.createWriteStream(path.join(path.join(__dirname, 'logs'), 'requests.log'), { flags: 'a' });
app.use(
  morgan('dev', {
    stream: logStream
  })
);

//* CronJobs
// cronJobFunc();

//* Middlewares
app.use((req: Request, res: Response, next) => {
  res.set({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    sessionid: ''
  });
  next();
});

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', express.static('public'));

//* Setup Localization
app.use((request: Request, response: Response, next: NextFunction) => {
  const lang = localizify.detectLocale(request.headers['accept-language']) || 'fa';
  localizify.setLocale(lang as string);
  // response.t = localizify.t;
  response.t = localizifyT;
  next();
});

//! Secure
//Helmet
app.use(helmet());

//Apply the rate limiting middleware to all requests
// app.use(require('./middlewares/secure'))

//Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());

//Data Sanitization against XSS attacks
app.use(xss());
//! End of Secure

//* Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));


//* Routes
import mainRouter from './routers/index';
app.use('/', mainRouter);
// health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Server is Running'
  });
});

app.use((err: Error_, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

const PORT = process.env.APP_PORT || 3060;
// const server = http.createServer(app);

export const server = app.listen(PORT, async () => {
  console.log('Server start listening on: ', server.address());
});
