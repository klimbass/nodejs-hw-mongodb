import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import MongoStore from 'connect-mongo';
import { MONTH } from './constants/index.js';
import session from 'express-session';


const PORT = Number(env('PORT', 3000));

const user = env('MONGODB_USER');
const pwd = env('MONGODB_PASSWORD');
const url = env('MONGODB_URL');
const db = env('MONGODB_DB');

const store = new MongoStore({
  mongoUrl: `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=AquaTrackApp`,
  collectionName: 'sessions',
  ttl: MONTH,
  autoRemove: 'native',
});

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://goit-react-hw-08-five-gamma.vercel.app/'
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(session({
    secret: env('SESSION_SECRET_KEY'),
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      // sameSite: 'lax', // або 'none' з `secure: true` для HTTPS
    },
  }));


  app.get('/', (req, res) => {
    res.send('Welcome to the homepage');
  });
  app.use('/api-docs', swaggerDocs());
  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
