import dotenv from 'dotenv'
dotenv.config();
export const portNumber = 9002;
export const userContext = "/user";
export const sellerContext = '/seller'
export const swaggerContext='/swagger/api-docs'
export const userActivityContext='/user/activity'
export const NODEMAILER_CONFIG = {
  service: "gmail",
  auth: {
    user: `${process.env.USER_EMAIL}`,
    pass: `${process.env.USER_PASS}`,
  },
};
export enum MAIL_SUBJECT {
  VERIFICATION_OTP = "Otp Verification",
}
export const DATABASE = {
  VALIDATION: {
    PASSWORD_ERROR_MSG:"Password should contain alphanumeric and special characters",
    PHONE_NO_ERROR_MSG: "Enter a valid phone number",
    ENTER_VALID_OTP: "Enter the valid OTP",
    EMAIL_ERROR_MSG: "Enter a valid email address",
  },
};

export const GRPC_HOST='0.0.0.0'
export const GRPC_PORT=30000