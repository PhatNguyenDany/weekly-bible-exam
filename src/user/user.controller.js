import path from 'path';
import { writeFile } from '../../utils/fileIO.js';
import { computeUserAge, getGroupByAge } from '../../utils/utils.js';
import { getGroupData } from '../group/group.service.js';
import { getUserData, validatePropertiesUser } from './user.service.js';
import { hashPassword } from '../auth/auth.service.js';
;

const __dirname = path.resolve();
const fileUserPath = path.join(__dirname, './data/user.json');
// Retrieve user on user
function getUser(req, resp) {
  const userData = getUserData();
  if (!userData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
  if (req.user.role === 'ADMIN') {
    return resp.status(200).json(userData);
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  };
};
// update user
function updateUser(req, resp) {
  const userData = getUserData();
  const groupData = getGroupData();
  // Check data is available
  if (!userData || !groupData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
  const indexUser = userData.findIndex((user) => user.id.toString() === req.params.id);
  let user = userData[indexUser];
  if (!user) {
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
  try {
    validatePropertiesUser(userUpdate, req.user.id);
  } catch (error) {
    return resp.status(400).json({ msg: error.message });
  }
  if (userUpdate.password) {
    userUpdate.password = hashPassword(userUpdate.password);
  }
  // Check birthday input
  const age = computeUserAge(userUpdate.birthday);
  // Find a group that has newUser's age between fromAge and toAge of this group
  const groupResult = getGroupByAge(groupData, age);
  // user id and role
  userUpdate.id = Number(req.params.id);
  userUpdate.role = 'USER';
  // set new user's groupId equal group id that found above
  userUpdate.groupId = groupResult.groupId;
  user = { ...user, ...userUpdate };
  userData[indexUser] = user;
  writeFile(fileUserPath, userData);
  return resp.status(200).json({ data: user, msg: 'Update user successful' });
};

// update user by user's id
function updateUserById(req, resp) {
  if (req.user.role === 'ADMIN') {
    // Check data is available
    const userData = getUserData();
    const groupData = getGroupData();
    if (!userData || !groupData) {
      resp.status(500).json({ msg: 'Something went wrong' });
    }
    const indexUser = userData.findIndex((user) => user.id.toString() === req.params.id);
    let user = userData[indexUser];
    if (!user) {
      return resp.status(400).json({ msg: 'Can not found id user' });
    }
    // get data from the request body
    const userUpdate = req.body;
    if (userUpdate instanceof Object === true) {
      if (!userUpdate) {
        return resp.status(400).json({ msg: 'Wrong input properties user' });
      }
      // Check each properties in Object have value yet
      try {
        validatePropertiesUser(userUpdate, req.params.id);
      } catch (error) {
        return resp.status(400).json({ msg: error.message });
      }
      if (userUpdate.password) {
        userUpdate.password = hashPassword(userUpdate.password);
      }
      // check birthday input and find user's age
      const age = computeUserAge(userUpdate.birthday);
      // Find a group that has newUser's age between fromAge and toAge of this group
      const groupResult = getGroupByAge(groupData, age);
      // user id and role
      userUpdate.id = Number(req.params.id);
      userUpdate.role = 'USER';
      // set new user's groupId equal group id that found above
      userUpdate.groupId = groupResult.groupId;
      user = { ...user, ...userUpdate };
      userData[indexUser] = user;
      writeFile(fileUserPath, userData);
      return resp.status(200).json({ data: user, msg: 'Update user successful' });
    } else {
      return resp.status(200).json({ msg: 'You don\'t have permission' });
    };
  }
}

// Delete a user
function deleteUserProfile(req, resp) {
  const userData = getUserData();
  if (!userData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
  const indexUser = userData.findIndex((user) => user.id.toString() === req.user.id);
  if (indexUser === -1) {
    return resp.status(404).json({ msg: 'can not found user' });
  };
  userData.splice(indexUser, 1);
  // update data to file
  writeFile(fileUserPath, userData);
  return resp.status(200).json({ msg: 'user deleted successfully' });
};

// Delete a user by its user ID
function deleteUserById(req, resp) {
  const userData = getUserData();
  if (!userData) {
    return resp.status(500).json({ msg: 'Something went wrong' });
  }
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
};

export default { getUser, updateUserById, updateUser, deleteUserProfile, deleteUserById };
