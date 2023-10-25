"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionValidator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("../provider/redis/redis");
const session_entity_1 = require("../entity/session.entity");
const exception_utils_1 = require("../utils/exception.utils");
const enum_1 = require("../interface/enum");
const response_util_1 = require("../utils/response.util");
dotenv_1.default.config();
class SessionValidator {
    constructor() { }
    checkSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = "" + req.headers.authorization;
                let SECRET_KEY = "" + process.env.SECRET_KEY;
                let decodeData = JSON.parse(JSON.stringify(jsonwebtoken_1.default.verify(token, SECRET_KEY)));
                let redisSessionData = redis_1.redis.getKey(decodeData._id);
                req.headers._id = decodeData._id;
                req.headers.userType = decodeData.type;
                if (redisSessionData == decodeData.deviceId) {
                    next();
                }
                else {
                    let sessionData = yield session_entity_1.sessionEntity.findOne({
                        deviceId: decodeData.deviceId,
                        userId: decodeData._id,
                        isActive: true,
                    }, { _id: 1 });
                    if (sessionData) {
                        redis_1.redis.setKeyWithExpiry(`${decodeData._id}`, `${decodeData.deviceId}`, 9000);
                        next();
                    }
                    else {
                        throw new exception_utils_1.CustomException(enum_1.ExceptionMessage.UNAUTHORIZED, enum_1.HttpStatusMessage.UNAUTHORIZED);
                    }
                }
            }
            catch (error) {
                let err = response_util_1.responseUitls.errorResponse(error);
                res.send(err);
            }
        });
    }
}
exports.sessionValidator = new SessionValidator();
