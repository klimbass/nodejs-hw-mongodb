import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(
      createHttpError(404, {
        status: 404,
        message: 'Not correct id',
        data: { message: 'Not correct id' },
      }),
    );
  }
  next();
};

export default isValidId;
