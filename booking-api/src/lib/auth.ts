import crypto from 'crypto';

export function getSaltedHash(valueToHash: string, salt: string) {
  const saltedValue = `${salt}${valueToHash}`;
  return crypto.createHash('md5').update(saltedValue).digest('hex');
}
