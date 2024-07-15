import { CONTACT_TYPE_LIST } from '../constants/contact-constants.js';

const parseType = (type) => {
  if (typeof type !== 'string') return;
  if (CONTACT_TYPE_LIST.includes(type)) return type;
};

const parseFavourite = (favourite) => {
  if (typeof favourite !== 'string') return;
  if (['false', 'true'].includes(favourite)) return favourite === 'true';
};

export const parseFilterParams = ({ isFavourite, contactType, userId }) => {
  const parsedIsFavourite = parseFavourite(isFavourite);
  const parsedContactType = parseType(contactType);
  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedContactType,
    userId: userId,
  };
};
