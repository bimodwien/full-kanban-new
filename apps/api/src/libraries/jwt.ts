import { sign, SignOptions } from 'jsonwebtoken';
import { SECRET_KEY } from '@/config';

export const createToken = (
  payload: any,
  expiresIn: SignOptions['expiresIn'] = '1d',
) => {
  return sign(payload, SECRET_KEY, { expiresIn });
};
