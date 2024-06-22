import * as yup from "yup";

export const listingSchema = yup.object().shape({
  name: yup
    .string()
    .required()
    .min(5, "Name must be at least 5 characters long"),
  description: yup
    .string()
    .required()
    .min(50, "Description must be at least 50 characters long"),
  address: yup
    .string()
    .required()
    .min(10, "Address must be at least 10 characters long"),
  bedrooms: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required()
    .positive()
    .integer(),
  bathrooms: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required()
    .positive()
    .integer(),
  regularPrice: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required()
    .positive(),
  discountPrice: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .required()
    .positive(),
});

  export const signupSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters long")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });


  export const updateProfileSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters long")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .test(
        "empty-or-valid",
        "Password must be at least 8 characters long",
        value => value === "" || value.length >= 8
      )
  });
  