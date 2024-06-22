import * as yup from "yup";

export const listingSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .min(5, "Name must be at least 5 characters long"),
    description: yup
      .string()
      .required("Description is required")
      .min(50, "Description must be at least 50 characters long"),
    address: yup
      .string()
      .required("Address is required")
      .min(10, "Address must be at least 10 characters long"),
    bedrooms: yup.number().required("Bedrooms is required").positive().integer(),
    bathrooms: yup
      .number()
      .required("Bathrooms is required")
      .positive()
      .integer(),
    regularPrice: yup.number().required("Regular Price is required").positive(),
    discountPrice: yup.number().required("Discount Price is required").positive(),
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
  