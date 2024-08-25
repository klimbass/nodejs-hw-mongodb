import createHttpError from 'http-errors';
import {
  findUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { setupSessionCookies } from '../utils/createSession.js';

export const registerUserController = async (req, res) => {
  const { email } = req.body;
  const userInDb = await findUser({ email });
  if (userInDb) {
    throw createHttpError(409, 'Email in use');
  }
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const {user, session} = await loginUser(req.body);

  setupSessionCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
console.log(`Cookies in refresh controller: ${req.cookies.sessionId, req.cookies.refreshToken} `);

  const {user, session} = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSessionCookies(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  console.log(sessionId);

  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId', {
    httpOnly: true,
    sameSite: 'none',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'none'
  });

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.status(200).json({
    status: 200,
    message: 'Password was successfully reset.',
    data: {},
  });
};
