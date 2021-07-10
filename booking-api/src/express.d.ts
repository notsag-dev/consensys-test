import { User } from './repositories/user';

declare module 'express-serve-static-core' {
  interface Request {
    authUser?: User;
  }
}
