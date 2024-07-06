export const CONTACT_TYPE_LIST = ['personal', 'work', 'home'];
export const PHONE_PATTERN =
  /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,3}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 20;
export const PHONE_NUMBER_MIN_LENGTH = 3;
export const PHONE_NUMBER_MAX_LENGTH = 20;

export const SORT_ORDER = ['asc', 'desc'];

export const KEY_OF_CONTACTS = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];
