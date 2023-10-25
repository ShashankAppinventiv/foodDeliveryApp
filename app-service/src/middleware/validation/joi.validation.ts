import Joi, { string } from "joi";
import { DATABASE } from "../../constant/constants";
import { CATEGORY, USER_TYPE } from "../../interface/enum";

const CUSTOM_JOI = {
  PASSWORD: Joi.string()
    .min(8)
    .max(64)
    .trim()
    .required()
    .regex(/^(?=.*\w)(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Z\w\d\W]{10,64}$/)
    .error(new Error(DATABASE.VALIDATION.PASSWORD_ERROR_MSG)),
  EMAIL: Joi.string()
    .min(1)
    .required()
    .trim()
    .error(new Error(DATABASE.VALIDATION.EMAIL_ERROR_MSG)),

  PHONE_NO: Joi.number()
    .required()
    .error(new Error(DATABASE.VALIDATION.PHONE_NO_ERROR_MSG)),
};
const locationSchema = Joi.object({
  type: Joi.string().equal("Point").required(),
  coordinates: Joi.array().items(Joi.number()).length(2).required(),
});
const locationSchemaOptional = Joi.object({
  type: Joi.string().equal("Point").required(),
  coordinates: Joi.array().items(Joi.number()).length(2).required(),
});

export const JOI_VALIDATION = {
  USER: {
    SIGN_IN: {
      name: Joi.string().trim().min(1).required(),
      username: Joi.string().trim().min(4).required(),
      password: CUSTOM_JOI.PASSWORD.required(),
      email: CUSTOM_JOI.EMAIL.required(),
      mobile: CUSTOM_JOI.PHONE_NO,
      type: Joi.string()
        .valid(...Object.values(USER_TYPE))
        .required(),
    },
    ADDRESS: {
      city:Joi.string().trim().min(1).required(),
      street:Joi.string().trim().min(1).required(),
      description: Joi.string().trim().min(1).required(),
      location: locationSchema
    },
    OTP: {
      otp: Joi.string().min(6).required(),
    },
    LOGIN: {
      username: Joi.string().trim().min(1).required(),
      password: CUSTOM_JOI.PASSWORD.required(),
      deviceId: Joi.string().required(),
    },
    UPDATE_PROFILE: {
      name: Joi.string().trim().min(1).optional(),
      mobile: CUSTOM_JOI.PHONE_NO.optional(),
      type: Joi.string()
        .valid(...Object.values(USER_TYPE))
        .optional(),
    },
    EMAIL: {
      email: CUSTOM_JOI.EMAIL.required(),
    },
    FORGET_PASSWORD: {
      password: CUSTOM_JOI.PASSWORD,
      otp: Joi.string().min(6).required(),
    },
  },
  RESTURANT: {
    ADD: {
      name: Joi.string().trim().min(1).required(),
      description: Joi.string().trim().min(2).required(),
      location: locationSchema,
    },
    UPDATE: {
      name: Joi.string().trim().min(1).required(),
      description: Joi.string().trim().min(2).required(),
      location: locationSchemaOptional.optional(),
    },
    UPDATE_PARAM: {
      resturantId: Joi.string().trim().required(),
    },
    REMOVE: {
      resturantId: Joi.string().trim().min(1).required(),
    },
  },
  FOOD: {
    ADD: {
      name: Joi.string().trim().min(1).required(),
      description: Joi.string().trim().min(2).required(),
      category:Joi.string().valid(...Object.values(CATEGORY)).required(),
      price: Joi.number().required().greater(0),
    },
    ADD_PARAM: {
      resturantId: Joi.string().trim().required(),
    },
    UPDATE_PARAM:{
      foodId: Joi.string().trim().required(),
    },
    UPDATE: {
      name: Joi.string().trim().min(1).optional(),
      description: Joi.string().trim().min(2).optional(),
      category:Joi.string().valid(...Object.values(CATEGORY)).optional(),
      price: Joi.number().required().greater(0).optional(),
    },
    REMOVE: {
      foodId: Joi.string().trim().min(1).required(),
    },
  },
  COORDINATES:{
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  },
  CART: {
    ADDTOCART:{
      foodId:Joi.string().trim().required()
    }
  },
  ORDERS: {
    BUY:{
      addressId:Joi.string().trim().required()
    }
  },
  SEARCH_FOOD:{
    resturantId:Joi.string().trim().min(1).required(),
    foodName:Joi.string().trim().min(2).optional(),
    category:Joi.string().trim().min(2).optional()
  }
};
