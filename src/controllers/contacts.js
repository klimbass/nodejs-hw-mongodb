import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParam } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParam(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const user = req.user._id;
  const filter = parseFilterParams({ ...req.query, userId: user });

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const user = req.user._id;
  const { contactId } = req.params;
  const contact = await getContactById(contactId, user);

  if (!contact) {
    return next(
      createHttpError(404, {
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' },
      }),
    );
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  let photo;
  let photoURL = '';
  if(req.file){
    photo = req.file;
    photoURL = await saveFileToCloudinary(photo);
  };
  const contact = await createContact({ userId, ...req.body, photo: photoURL});

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact`,
    data: contact,
  });
};
export const patchContactController = async (req, res, next) => {
  const user = req.user._id;
  const { contactId } = req.params;
  const result = await updateContact(contactId, user, req.body);

  if (!result) {
    next(
      createHttpError(404, {
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' },
      }),
    );
    return;
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const user = req.user._id;
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, user);

  if (!contact) {
    next(
      createHttpError(404, {
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' },
      }),
    );



    return;
  }
  console.log(`Console in controller, deleted contact: ${contact} `);
  res.status(201).json({
    status: 201,
    message: 'Successfully deleted contact',
    data: contact,
  });
};
