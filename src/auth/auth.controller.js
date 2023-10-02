import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { readFile, writeFile } from '../../utils/fileIO.js';
import { computeUserAge, getGroupByAge, getNextId } from '../../utils/utils.js';
import { getUserData, validateDuplicateUserPhone, validateDuplicateUsername, validatePropertiesUser, validateUserGender } from '../user/user.service.js';
import { comparePassword, generateToken, hashPassword } from './auth.service.js';

// import { group } from 'console';
const app = express();
// Điều này tạo ra đường dẫn tới tệp data.json trong cùng thư mục với tệp mã nguồn của bạn.
const __dirname = path.resolve();
const fileUserPath = path.join(__dirname, './data/user.json');
const fileGroupPath = path.join(__dirname, './data/group.json');
// Middleware body-parser giúp xử lý dữ liệu được gửi đến máy chủ từ các yêu cầu HTTP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Get data from files
const userData = readFile(fileUserPath);
const groupData = readFile(fileGroupPath);

// Create user
function register(req, resp) {
  // Check data is available
  if (!userData || !groupData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
  // get data from the request body
  const newUser = req.body;
  if (newUser instanceof Object === true) {
    if (!newUser) {
      return resp.status(400).json({ msg: 'Wrong input properties user' });
    }
  }
  // Check each properties in Object have value yet
  try {
    validatePropertiesUser(newUser);
  } catch (error) {
    return resp.status(400).json({ msg: error.message });
  }
  // check user gender input
  try {
    validateUserGender(newUser);
  } catch (error) {
    return resp.status(400).json({ msg: error.message });
  }
  // check user phonenumber input
  try {
    validateDuplicateUserPhone(userData, newUser);
  } catch (error) {
    return resp.status(400).json({ msg: error.message });
  }
  // check duplicated username of user
  try {
    validateDuplicateUsername(userData, newUser);
  } catch (error) {
    return resp.status(400).json({ msg: error.message });
  }
  newUser.password = hashPassword(newUser.password);
  // check birthday input and find user's age
  const age = computeUserAge(newUser.birthday);
  // Find a group that has newUser's age between fromAge and toAge of this group
  console.log('groupData', groupData, 'age', age);
  const groupResult = getGroupByAge(groupData, age);

  // set new user's groupId equal group id that found above
  newUser.groupId = groupResult.groupId;
  // Get last user and increase user's id to 1
  const nextId = getNextId(userData);
  newUser.id = nextId;
  newUser.role = 'USER';
  // update data to file
  userData.push(newUser);
  writeFile(fileUserPath, userData);
  return resp.status(200).json({ data: newUser, msg: 'Create new user successful' });
};

async function login(req, resp) {
  const username = req.body.username;
  const password = req.body.password;
  /// tìm user có username trong userData
  const userData = getUserData();
  // Check data is available
  if (!userData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
  const user = userData.find((user) => user.username === username);
  if (!user) {
    return resp.status(400).json({ msg: 'Can not found username' });
  }
  // nếu có thì lấy password ra so sánh với password truyền vào
  // không có thì báo lỗi username or password không đúng
  const isMatch = comparePassword(password, user.password);
  if (isMatch === false) {
    return resp.status(400).json({ msg: 'user or password are incorrect' });
  }
  // tạo payload cho access token với username và userid
  const payload = {
    username: user.username,
    userid: user.id,
    role: user.role
  };
  const secretSignature = process.env.ACCESS_TOKEN_SECRET;
  // tạo access token từ payload
  const accessToken = await generateToken(payload, secretSignature, '1h');
  return resp.status(200).json({ accessToken });
  /// trả access token về cho user
}

export default { register, login };
