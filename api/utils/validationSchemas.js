// The Joi library is a powerful and flexible validation library for JavaScript, 
// often used with Node.js to validate data structures such as request payloads, query parameters, 
// and configuration objects.. Joi provides server-side validation. 
// It is commonly used in server-side applications, especially in Node.js, to validate data before processing it.
import BaseJoi from 'joi';

// This is a library that allows you to sanitize HTML input to prevent XSS attacks.
import sanitizeHtml from 'sanitize-html';

// This is a custom Joi extension that sanitizes HTML input.
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// This extends the Joi library with the custom extension.
const Joi = BaseJoi.extend(extension)


export const createListingSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    address: Joi.string().required().escapeHTML(),
    type: Joi.string().valid('sale', 'rent').required().escapeHTML(),
    parking: Joi.boolean().required(),
    furnished: Joi.boolean().required(),
    offer: Joi.boolean().required(),
    bedrooms: Joi.number().required().min(1).max(20),
    bathrooms: Joi.number().required().min(1).max(20),
    regularPrice: Joi.number().required().min(0),
    discountPrice: Joi.number().required().min(0),
    imageUrls: Joi.array().items(Joi.string().uri()).required(),
    userRef: Joi.string().required()
});

export const editListingSchema = Joi.object({
    name: Joi.string().escapeHTML(),
    description: Joi.string().escapeHTML(),
    address: Joi.string().escapeHTML(),
    type: Joi.string().valid('sale', 'rent').escapeHTML(),
    parking: Joi.boolean(),
    furnished: Joi.boolean(),
    offer: Joi.boolean(),
    bedrooms: Joi.number().required().min(1).max(20),
    bathrooms: Joi.number().required().min(1).max(20),
    regularPrice: Joi.number().min(0),
    discountPrice: Joi.number().min(0),
    imageUrls: Joi.array().items(Joi.string().uri())
});

export const signUpSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    password: Joi.string().required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML()
});

export const signInSchema = Joi.object({
    email: Joi.string().email().required().escapeHTML(),
    password: Joi.string().required().escapeHTML()
});

export const googleLoginSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML(),
    avatar: Joi.string().uri().required().escapeHTML()
});

export const updateProfileSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML(),
    avatar: Joi.string().uri().required().escapeHTML(),
    password: Joi.string().allow('').escapeHTML()
});
