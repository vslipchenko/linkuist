import {Document} from 'mongoose';

export interface UserModel {
  email: string;
  username: string;
  password: string;
  accessKey: string;
}

export interface UserDocument extends UserModel, Document {}
