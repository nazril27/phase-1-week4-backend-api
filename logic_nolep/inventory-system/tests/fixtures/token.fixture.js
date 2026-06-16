import moment from "moment/moment";
import config from "../../src/config/config.js";
import tokenTypes from "../../src/config/tokens.js";
import tokenService from "../../src/service/token.service.js";
import { userOne, admin } from "./user.fixture.js";

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

export const userOneAccessToken = tokenService.generateToken(userOne.id, accessTokenExpires, tokenTypes.ACCESS);
export const adminAccessToken = tokenService.generateToken(admin.id, accessTokenExpires, tokenTypes.ACCESS);