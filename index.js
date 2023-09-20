import bodyParser from 'body-Parser';
import express from 'express';
import path from 'path';
import { readFile, writeFile } from './utills/fileIO.js';
import { validateDuplicateGroup, validateDuplicateUserPhone, validateDuplicateUsername, validatePropertiesUser, validateUserGender } from './utills/validate.js';
import { isAuth } from './auth.js';
import { computeUserAge, getGroupByAge, getNextId } from './utills/utills.js';

// import { group } from 'console';
const app = express();
const port = process.env.PORT;
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

// Retrieve group on group
app.get('/group', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    resp.status(200).json(groupData);
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
});

// Retrieve a group by  it's groupname using the req.query method
app.get('/group/groupName', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    const findGroup = groupData.find((group) => group.groupName.toLowerCase().includes(req.query.groupName.toLowerCase()));
    // "The .toLowerCase() method is used to change a string to lowercase."
    if (!findGroup) {
      resp.status(400).json({ msg: 'Cannot found group for groupName' });
    } else {
      resp.status(200).json(findGroup);
    }
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
});

// Retrieve a group by age using the req.query method
app.get('/group/age', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    const findGroup = groupData.find((group) => group.fromAge <= req.query.age && req.query.age <= group.toAge);
    if (!findGroup) {
      return resp.status(400).json({ msg: 'Cannot found group for groupAge' });
    }
    resp.status(200).json(findGroup);
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
});

// Retrieve a group by it's groupID using the req.query method
app.get('/group/groupId', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    const findGroup = groupData.find((group) => group.groupId.toString() === req.query.groupId);
    if (!findGroup) {
      resp.status(400).json({ msg: 'Cannot found group for groupId' });
    } else {
      resp.status(200).json(findGroup);
    }
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
});

// Create group
app.post('/group', (req, resp) => {
  if (req.user.role === 'ADMIN') {
    if (!groupData && groupData instanceof Array === false) {
      return resp.status(500).json({ msg: 'Something went wrong' });
    }
    const newGroup = req.body;
    // Check each properties in Object have value yet
    if (!newGroup.groupName || !newGroup.fromAge || !newGroup.toAge) {
      return resp.status(400).json({ msg: 'Wrong input update group,please fill in all required information' });
    };
    // Check duplicated groupName
    let isDuplicatedGroup;
    try {
      isDuplicatedGroup = validateDuplicateGroup(groupData, newGroup);
    } catch (error) {
      resp.status(400).json({ msg: error.message });
      return;
    }
    if (isDuplicatedGroup === true) {
      return resp.status(400).json({ msg: 'The error of having duplicated group' });
    }
    // Get last group and increase group's id to 1
    const nextGroupId = getNextId(groupData);
    newGroup.groupId = nextGroupId;
    // update data to file
    groupData.push(newGroup);
    writeFile(fileGroupPath, groupData);
    resp.status(200).json({ data: newGroup, msg: 'Create new group successful' });
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  };
});

// update group by groupId
app.put('/group/:groupId', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    if (!groupData) {
      resp.status(500).json({ msg: 'Something went wrong' });
    }
    const indexGroup = groupData.findIndex((group) => group.groupId.toString() === req.params.groupId);
    if (indexGroup === -1) {
      return resp.status(400).json({ msg: "Can not find group with group's id " });
    }
    const newGroupUpDate = req.body;
    // Check each properties in Object have value yet
    if (!newGroupUpDate.groupName || !newGroupUpDate.fromAge || !newGroupUpDate.toAge) {
      return resp.status(400).json({ msg: 'Wrong input update group,please fill in all required information' });
    };
    // Check duplicated groupName
    let isDuplicatedGroup;
    try {
      isDuplicatedGroup = validateDuplicateGroup(groupData, newGroupUpDate);
    } catch (error) {
      resp.status(400).json({ msg: error.message });
      return;
    }
    if (isDuplicatedGroup === true) {
      return resp.status(400).json({ msg: 'Unable to update a group, duplicate groups exist' });
    }
    newGroupUpDate.groupId = Number(req.params.groupId);
    groupData[indexGroup] = newGroupUpDate;
    writeFile(fileGroupPath, groupData);
    resp.status(200).json({ data: newGroupUpDate, msg: 'UpDate group successful' });
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  };
});

// Delete a group by its group ID
app.delete('/group/:groupId', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    const indexGroup = groupData.findIndex((group) => group.groupId.toString() === req.params.groupId);
    if (indexGroup === -1) {
      return resp.status(404).json({ msg: 'can not found group' });
    }
    groupData.splice(indexGroup, 1);
    // update data to file
    writeFile(fileGroupPath, groupData);
    resp.status(200).json({ msg: 'group deleted successfully' });
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  };
});

// Retrieve user on user
app.get('/user', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    resp.status(200).json(userData);
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  };
});

// Create user
app.post('/user', (req, resp) => {
  // Check data is available
  if (!userData || !groupData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
  // get data from the request body
  const newUser = req.body;
  if (newUser instanceof Object === true) {
    if (!newUser) {
      return resp.status(400).json({ msg: 'Wrong input properties user' });
    } else {
      return resp.status(400).json({ msg: 'Wrong input newuser' });
    }
  }
  // Check each properties in Object have value yet
  let isPropertiesUser;
  try {
    isPropertiesUser = validatePropertiesUser(newUser);
  } catch (error) {
    resp.status(400).json({ msg: error.message });
    return;
  }
  if (isPropertiesUser === false) {
    return resp.status(400).json({ msg: 'Unable to create a user' });
  }
  // check user gender input
  let isGender;
  try {
    isGender = validateUserGender(userData, newUser);
  } catch (error) {
    resp.status(400).json({ msg: error.message });
    return;
  }
  if (isGender === false) {
    return resp.status(400).json({ msg: 'Unable to create user' });
  }
  // check user phonenumber input
  let isDuplicatedUserPhone;
  try {
    isDuplicatedUserPhone = validateDuplicateUserPhone(userData, newUser);
  } catch (error) {
    resp.status(400).json({ msg: error.message });
    return;
  }
  if (isDuplicatedUserPhone === true) {
    return resp.status(400).json({ msg: 'Duplicate userphone exist' });
  }
  // check duplicated username of user
  let isDuplicatedUsername;
  try {
    isDuplicatedUsername = validateDuplicateUsername(userData, newUser);
  } catch (error) {
    resp.status(400).json({ msg: error.message });
    return;
  }
  if (isDuplicatedUsername === true) {
    return resp.status(400).json({ msg: 'Unable to create a user, duplicate username exist' });
  }
  // check birthday input and find user's age
  const age = computeUserAge(newUser.birthday);
  // Find a group that has newUser's age between fromAge and toAge of this group
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
});

// update user
app.put('/user/', isAuth, (req, resp) => {
  // Check data is available
  if (!userData || !groupData) {
    resp.status(500).json({ msg: 'Something went wrong' });
  }
  const indexUser = userData.findIndex((user) => user.id.toString() === req.user.id);
  if (indexUser === -1) {
    return resp.status(400).json({ msg: 'Can not found id user' });
  }
  // get data from the request body
  const userUpdate = req.body;
  if (userUpdate instanceof Object === true) {
    if (!userUpdate) {
      return resp.status(400).json({ msg: 'Wrong input properties user' });
    } else {
      return resp.status(400).json({ msg: 'Wrong input user update' });
    }
  }
  // Check each properties in Object have value yet
  let isPropertiesUser;
  try {
    isPropertiesUser = validatePropertiesUser(userUpdate);
  } catch (error) {
    resp.status(400).json({ msg: error.message });
    return;
  }
  if (isPropertiesUser === false) {
    return resp.status(400).json({ msg: 'Unable to update a user, duplicate userphone exist' });
  }
  // Check birthday input
  const age = computeUserAge(userUpdate.birthday);
  // Find a group that has newUser's age between fromAge and toAge of this group
  const groupResult = getGroupByAge(groupData, age);
  // user id and role
  userUpdate.id = Number(req.params.id);
  userUpdate.role = 'USER';
  // set new user's groupId equal group id that found above
  userData[indexUser] = userUpdate;
  userUpdate.groupId = groupResult.groupId;
  writeFile(fileUserPath, userData);
  resp.status(200).json({ data: userUpdate, msg: 'Update user successful' });
});

// update user by user's id
app.put('/user/:id', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    // Check data is available
    if (!userData || !groupData) {
      resp.status(500).json({ msg: 'Something went wrong' });
    }
    const indexUser = userData.findIndex((user) => user.id.toString() === req.params.id);
    if (indexUser === -1) {
      return resp.status(400).json({ msg: 'Can not found id user' });
    }
    // get data from the request body
    const userUpdate = req.body;
    if (userUpdate instanceof Object === true) {
      if (!userUpdate) {
        return resp.status(400).json({ msg: 'Wrong input properties user' });
      } else {
        return resp.status(400).json({ msg: 'Wrong input user update' });
      }
    }
    // Check each properties in Object have value yet
    let isPropertiesUser;
    try {
      isPropertiesUser = validatePropertiesUser(userUpdate);
    } catch (error) {
      resp.status(400).json({ msg: error.message });
      return;
    }
    if (isPropertiesUser === false) {
      return resp.status(400).json({ msg: 'Unable to update a user, duplicate userphone exist' });
    }
    // check birthday input and find user's age
    const age = computeUserAge(userUpdate.birthday);
    // Find a group that has newUser's age between fromAge and toAge of this group
    const groupResult = getGroupByAge(groupData, age);
    // user id and role
    userUpdate.id = Number(req.params.id);
    userUpdate.role = 'USER';
    // set new user's groupId equal group id that found above
    userData[indexUser] = userUpdate;
    userUpdate.groupId = groupResult.groupId;
    writeFile(fileUserPath, userData);
    resp.status(200).json({ data: userUpdate, msg: 'Update user successful' });
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  };
});

// Delete a user by its user ID
app.delete('/user/:id', isAuth, (req, resp) => {
  if (req.user.role === 'ADMIN') {
    const indexUser = userData.findIndex((user) => user.id.toString() === req.params.id);
    if (indexUser === -1) {
      return resp.status(404).json({ msg: 'can not found user' });
    };
    userData.splice(indexUser, 1);
    // update data to file
    writeFile(fileUserPath, userData);
    resp.status(200).json({ msg: 'user deleted successfully' });
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
});

// Delete a user
app.delete('/user/profile', isAuth, (req, resp) => {
  const indexUser = userData.findIndex((user) => user.id.toString() === req.user.id);
  if (indexUser === -1) {
    return resp.status(404).json({ msg: 'can not found user' });
  };
  userData.splice(indexUser, 1);
  // update data to file
  writeFile(fileUserPath, userData);
  resp.status(200).json({ msg: 'user deleted successfully' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
