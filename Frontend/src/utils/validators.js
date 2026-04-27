export const nameValidation = {
  minLength: 20,
  maxLength: 60,
};

export const addressValidation = {
  maxLength: 400,
};

export const passwordValidation = {
  minLength: 8,
  maxLength: 16,
  pattern: "^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$",
  title:
    "Password must be 8-16 characters with one uppercase letter and one special character",
};

export const sortRows = (rows, sort) => {
  if (!sort.key) {
    return rows;
  }

  return [...rows].sort((a, b) => {
    const rawA = a[sort.key] ?? "";
    const rawB = b[sort.key] ?? "";
    const numericA = Number(rawA);
    const numericB = Number(rawB);
    const bothNumeric = rawA !== "" && rawB !== "" && !Number.isNaN(numericA) && !Number.isNaN(numericB);

    const aValue = bothNumeric ? numericA : String(rawA).toLowerCase();
    const bValue = bothNumeric ? numericB : String(rawB).toLowerCase();

    if (aValue < bValue) {
      return sort.direction === "asc" ? -1 : 1;
    }

    if (aValue > bValue) {
      return sort.direction === "asc" ? 1 : -1;
    }

    return 0;
  });
};
