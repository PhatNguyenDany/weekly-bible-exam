import bcrypt from 'bcrypt';

import jsonwebtoken from 'jsonwebtoken';
import path from 'path';
import { readFile } from './utills/fileIO.js';
const { sign, verify } = jsonwebtoken;
const __dirname = path.resolve();
const fileUserPath = path.join(__dirname, './data/user.json');

export function hashPassword(password) {
  const hashPassword = bcrypt.hashSync(password, 10);
  return hashPassword;
}

export function comparePassword(passwordInput, passwordHashed) {
  const isMatch = bcrypt.compareSync(hashPassword(passwordInput), passwordHashed);
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

export async function isAuth(req, resp, next) {
  const accessToken = req.header.authorization;
  if (!accessToken) {
    return resp.status(401).send({ msg: 'Invalid access token' });
  }

  const tokenVerified = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!tokenVerified) {
    return resp.status(401).send({ msg: 'Invalid access token' });
  }

  const userData = readFile(fileUserPath);

  const user = userData.find(user => user.username === tokenVerified.payload.username);

  if (!user) {
    return resp.status(404).send({ msg: 'User not found' });
  }
  req.user = user;

  next();
}
