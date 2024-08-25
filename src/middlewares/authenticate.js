import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Token must have Bearer type'));
  }
  if (!token) {
    return next(createHttpError(401, 'Token missing'));
  }

  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }
  const user = await UserCollection.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }
  req.user = user;
  next();
};
