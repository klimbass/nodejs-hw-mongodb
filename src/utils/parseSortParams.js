import { KEY_OF_CONTACTS, SORT_ORDER } from '../constants/contact-constants.js';

export const parseSortParams = ({ sortOrder, sortBy }) => {
  const parsedSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];
  const parsedSortBy = KEY_OF_CONTACTS.includes(sortBy)
    ? sortBy
    : KEY_OF_CONTACTS[0];
  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
