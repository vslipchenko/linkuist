import {Document} from 'mongoose';

export interface UserInterface {
  email: string;
  username: string;
  password: string;
  accessKey: string;
}

export interface UserDocument extends UserInterface, Document {}
