import Joi, { string } from "joi";
import { DATABASE } from "../../constant/constants";

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


export const JOI_VALIDATION = {
}