import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const findUser = (filter) => UserCollection.findOne(filter);

export const registerUser = async (payload) => {
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  console.log(encryptedPassword);
  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await findUser({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await SessionsCollection.deleteOne({ userId: user._id });
  const newSession = createSession();

  const session = await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
  return {user, session};
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Cookies has not!');
  }
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired!');
  }
  const user = await UserCollection.findById(session.userId);
  if(!user){
    throw createHttpError(401, 'User not found');
  }

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  const newSessionSet = createSession();
  const newSession = await SessionsCollection.create({
    userId: session.userId,
    ...newSessionSet,
  });
  return {user, session: newSession};
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',

    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
