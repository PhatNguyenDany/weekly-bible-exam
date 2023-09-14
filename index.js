import bodyParser from 'body-Parser';
import express from 'express';
import path from 'path';
import { readFile, writeFile } from './utills/fileIO.js';
import { checkDate } from './utills/date.js';
import moment from 'moment/moment.js';
import { validateDuplicateGroup } from './utills/validate.js';

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
app.get('/group', (req, resp) => {
  resp.status(200).json(groupData);
});
// Retrieve a group by  it's groupname using the req.query method
app.get('/group/groupName', (req, resp) => {
  const findGroup = groupData.find((group) => group.groupName.toLowerCase().includes(req.query.groupName.toLowerCase()));
  // "The .toLowerCase() method is used to change a string to lowercase."
  if (!findGroup) {
    resp.status(400).json({ msg: 'Cannot found group for groupName' });
  } else {
    resp.status(200).json(findGroup);
  }
});
// Retrieve a group by age using the req.query method
app.get('/group/age', (req, resp) => {
  const findGroup = groupData.find((group) => group.fromAge <= req.query.age && req.query.age <= group.toAge);
  if (!findGroup) {
    resp.status(400).json({ msg: 'Cannot found group for groupAge' });
  } else {
    resp.status(200).json(findGroup);
  }
});
// Retrieve a group by it's groupID using the req.query method
app.get('/group/groupId', (req, resp) => {
  const findGroup = groupData.find((group) => group.groupId.toString() === req.query.groupId);
  if (!findGroup) {
    resp.status(400).json({ msg: 'Cannot found group for groupId' });
  } else {
    resp.status(200).json(findGroup);
  }
});
// Create group
app.post('/group', (req, resp) => {
  if (!groupData) {
    resp.status(500).json({ msg: 'Something went wrong' });
  }
  const newGroup = req.body;
  if ((Object.keys(newGroup).length === 3)) {
    // Check each properties in Object have value yet
    if (!newGroup.groupName || !newGroup.fromAge || !newGroup.toAge) {
      resp.status(400).json({ msg: 'Wrong input group' });
    };
    // Check duplicated groupName
    let isDuplicatedGroup;
    try {
      isDuplicatedGroup = validateDuplicateGroup(groupData, newGroup);
    } catch (error) {
      resp.status(400).json({ msg: error.message });
      return;
    }
    if (isDuplicatedGroup === false) {
      // Get last group and increase group's id to 1
      const lastGroup = groupData[groupData.length - 1];
      newGroup.groupId = lastGroup.groupId + 1;
      // update data to file
      groupData.push(newGroup);
      writeFile(fileGroupPath, groupData);
      resp.status(200).json({ data: newGroup, msg: 'Create new group successful' });
    } else {
      resp.status(400).json({ msg: 'The error of having duplicated group' });
    }
  } else {
    resp.status(400).json({ msg: 'Unable to create a group, please fill in all required information' });
  }
});

app.put('/group/:groupId', (req, resp) => {
  const indexGroup = groupData.findIndex((group) => group.groupId.toString() === req.params.groupId);
  if (indexGroup >= 0) {
    const newGroupUpDate = req.body;
    if ((Object.keys(newGroupUpDate).length === 3)) {
      // Check each properties in Object have value yet
      if (!newGroupUpDate.groupName || !newGroupUpDate.fromAge || !newGroupUpDate.toAge) {
        resp.status(400).json({ msg: 'Wrong input update group' });
      };
      // Check duplicated groupName
      let isDuplicatedGroup;
      try {
        isDuplicatedGroup = validateDuplicateGroup(groupData, newGroupUpDate);
      } catch (error) {
        resp.status(400).json({ msg: error.message });
        return;
      }
      if (isDuplicatedGroup === false) {
        // Get last group and increase group's id to 1
        const lastGroup = groupData[groupData.length - 1];
        newGroupUpDate.groupId = lastGroup.groupId + 1;
        // update data to file
        groupData.push(newGroupUpDate);
        writeFile(fileGroupPath, groupData);
        resp.status(200).json({ data: newGroupUpDate, msg: 'UpDate group successful' });
      }
    } else {
      resp.status(400).json({ msg: 'Unable to update a group, please fill in all required information' });
    }
  } else {
    resp.status(400).json({ msg: "can not find group with group's id " });
  }
});

// Delete a group by its group ID
app.delete('/group/:groupId', (req, resp) => {
  const indexGroup = groupData.findIndex((group) => group.groupId.toString() === req.params.groupId);
  if (indexGroup >= 0) {
    groupData.splice(indexGroup, 1);
    // update data to file
    writeFile(fileGroupPath, groupData);
    resp.status(200).json({ msg: 'group deleted successfully' });
  } else {
    resp.status(404).json({ msg: 'can not found group' });
  }
});

app.post('/user', (req, resp) => {
  // Check data is available
  if (!userData || !groupData) {
    resp.status(500).json({ msg: 'Something went wrong' });
  }
  // get data from the request body
  const newUser = req.body;
  if (newUser && (Object.keys(newUser).length === 5)) {
    // Check each properties in Object have value yet
    if (!newUser.name || !newUser.address || !newUser.phone || !newUser.birthday || !newUser.gender) {
      resp.status(400).json({ msg: 'Wrong input user' });
    }
    // check birthday input and find user's age
    const isDate = checkDate(newUser.birthday);
    if (isDate === true) {
      const currentDate = moment();
      const age = currentDate.diff(newUser.birthday, 'years');
      // Find a group that has newUser's age between fromAge and toAge of this group
      const groupResult = groupData.find(groupItem => groupItem.fromAge < age && age < groupItem.toAge);
      // Get last user and increase user's id to 1
      const lastUser = userData[userData.length - 1];
      newUser.id = lastUser.id + 1;
      if (!groupResult) {
        resp.status(400).json({ msg: "Cannot found group for this user's age" });
      } else {
        // set new user's groupId equal group id that found above
        newUser.groupId = groupResult.id;
        // update data to file
        userData.push(newUser);
        writeFile(fileUserPath, userData);
        resp.status(200).json({ data: newUser, msg: 'Create new user successful' });
      }
    } else {
      resp.status(400).json({ msg: 'Wrong birthday input' });
    }
  } else {
    resp.status(400).json({ msg: 'Can not create new user' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
