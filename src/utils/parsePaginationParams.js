const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;
  const parsedNumber = parseInt(number);
  if (isNaN(parsedNumber)) return defaultValue;
  return parsedNumber;
};

export const parsePaginationParam = ({ page, perPage }) => {
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
