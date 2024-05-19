const bcrypt = require('bcrypt');

const saltRounds = 10;

export async function hash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err: Error, salt: string) {
      if (err) reject(err);
      bcrypt.hash(password, salt, function (err: Error, hash: string) {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
}

export function compare(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err: Error, result: boolean) {
      if (err) reject(err);
      resolve(result);
    });
  });
}