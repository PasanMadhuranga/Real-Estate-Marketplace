export const usernameValidator = (value) => {
  if (!/^[a-zA-Z0-9_]+$/.test(value))
    return "can only contain letters, numbers, and underscores";
  return false;
};

export const passwordValidator = (value) => {
  if (value.length < 8) {
    return "must contain at least 8 characters";
  }
  if (!/[A-Z]/.test(value)) {
    return "must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(value)) {
    return "must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(value)) {
    return "must contain at least one number";
  }
  return false;
};

export const emailValidator = (value) => {
  if (!/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(value))
    return "must be a valid email address";
  return false;
};

export const ListingNameValidator = (value) => {
  if (value.trim().length < 5) {
    return "must contain at least 5 characters";
  }
  return false;
};

export const ListingDescriptionValidator = (value) => {
  if (value.trim().length < 50) {
    return "must contain at least 50 characters";
  }
};

export const ListingPriceValidator = (value) => {
  if (parseInt(value) <= 0) {
    return "price must be a positive number";
  }
  return false;
};

export const ListingRoomValidator = (value) => {
  if (parseInt(value) <= 0 || parseInt(value) > 20) {
    return "must be between 1 and 20";
  }
  return false;
};

export const ListingAddressValidator = (value) => {
  if (!value.trim()) {
    return "Address is empty";
  }

  return false;
};
