import dotenv from 'dotenv';
import {parseCliFlagValue} from '../utilities/parsers';
import {Secret} from 'jsonwebtoken';
const environment = parseCliFlagValue('env');
// Include dev or prod env variables file dynamically
dotenv.config({path: `src/environments/.env.${environment}`});

interface ProcessEnvConstants {
  [key: string]: unknown;
  ACCESS_JWT_SECRET: Secret;
  REFRESH_JWT_SECRET_FRAGMENT: Secret;
}

export const {
  APP_PORT,
  MONGODB_URI,
  ACCESS_JWT_SECRET,
  ACCESS_JWT_EXPIRES_IN,
  REFRESH_JWT_SECRET_FRAGMENT,
  REFRESH_JWT_EXPIRES_IN
} = process.env as ProcessEnvConstants;
