import path from 'path';
import { readFile } from '../../utils/fileIO.js';

// Điều này tạo ra đường dẫn tới tệp data.json trong cùng thư mục với tệp mã nguồn của bạn.

export function getUserData() {
  const __dirname = path.resolve();
  const fileUserPath = path.join(__dirname, './data/user.json');
  const userData = readFile(fileUserPath);
  return userData;
}

export function validateDuplicateUsername(userData, newUser) {
  if (userData instanceof Array === true && newUser instanceof Object === true) {
    if (newUser.username.length > 5 && newUser.username.includes('@')) {
      const userNameDulicated = userData.find((user) => user.username.toString() === newUser.username);
      if (userNameDulicated) {
        throw Error('User name duplicated');
      }
      return;
    }
    throw Error('Wrong input username');
  }
  throw Error('Can not validate username');
}

export function validateDuplicateUserPhone(userData, newUser) {
  if (userData instanceof Array === true && newUser instanceof Object === true) {
    if (newUser.phone.length !== 10) {
      throw Error('Wrong user phonenumber input');
    }
    const indexNewUserPhoneDuplicated = userData.findIndex((user) => user.phone === newUser.phone);
    if (indexNewUserPhoneDuplicated >= 0) {
      throw Error('Duplicated user phone number');
    }
    return;
  }
  throw Error('Can not validate user phonenumber');
}

export function validateUserGender(newUser) {
  if (newUser instanceof Object === true) {
    console.log('test', newUser.gender);
    if (newUser.gender.toLowerCase() !== 'nam' && newUser.gender.toLowerCase() !== 'nữ') {
      throw Error('Wrong user gender input');
    }
    return;
  }
  throw Error('can not validated user gender');
}

export function validatePropertiesUser(newUser) {
  if (newUser instanceof Object === true) {
    if (newUser.name.length < 6) {
      throw Error('Wrong input new user name');
    }
    if (newUser.password.length < 8) {
      throw Error('Wrong input password');
    }
    if (!newUser.name || !newUser.birthday || !newUser.gender || !newUser.address || !newUser.phone || !newUser.username || !newUser.password) {
      throw Error('Please fill in all required information');
    }
    return;
  } throw Error('Can not validated user properties');
}
