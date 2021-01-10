import {Document} from 'mongoose';

export interface IUser {
  email: string;
  username: string;
  password: string;
  accessKey: string;
}

export interface UserDocument extends IUser, Document {}
