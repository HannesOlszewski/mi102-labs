import { model, Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  password: string;
  secret?: string;
  salt: string;
  joined: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secret: { type: String, required: false },
  salt: { type: String, required: true },
  joined: { type: Date, default: Date.now },
});

export const User = model<IUser>('User', UserSchema);
