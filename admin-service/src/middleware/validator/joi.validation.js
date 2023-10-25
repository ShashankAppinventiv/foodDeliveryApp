"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOI_VALIDATION = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../constant/constants");
const CUSTOM_JOI = {
    PASSWORD: joi_1.default.string()
        .min(8)
        .max(64)
        .trim()
        .required()
        .regex(/^(?=.*\w)(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Z\w\d\W]{10,64}$/)
        .error(new Error(constants_1.DATABASE.VALIDATION.PASSWORD_ERROR_MSG)),
    EMAIL: joi_1.default.string()
        .min(1)
        .required()
        .trim()
        .error(new Error(constants_1.DATABASE.VALIDATION.EMAIL_ERROR_MSG)),
    PHONE_NO: joi_1.default.number()
        .required()
        .error(new Error(constants_1.DATABASE.VALIDATION.PHONE_NO_ERROR_MSG)),
};
exports.JOI_VALIDATION = {};
