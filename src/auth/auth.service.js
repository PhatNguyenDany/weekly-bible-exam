import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

export function hashPassword(password) {
  const hashPassword = bcrypt.hashSync(password, 10);
  return hashPassword;
}

export function comparePassword(passwordInput, passwordHashed) {
  const isMatch = bcrypt.compareSync(passwordInput, passwordHashed);
  return isMatch;
}

export async function generateToken(payload, secretSignature, tokenLife) {
  try {
    return sign(payload, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function verifyToken(token, secretSignature) {
  try {
    return verify(token, secretSignature);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function decodeToken(token, secretSignature) {
  try {
    return verify(token, secretSignature, { ignoreExpiration: true });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
