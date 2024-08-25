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

const allowedOrigins = [
  'https://goit-react-hw-08-five-gamma.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

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
      sameSite: 'lax',
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
