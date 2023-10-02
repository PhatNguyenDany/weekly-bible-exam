import path from 'path';
import { writeFile } from '../../utils/fileIO.js';
import { getNextId } from '../../utils/utils.js';
import { getGroupData, validateDuplicateGroup, validatePropertiesGroup } from './group.service.js';
const __dirname = path.resolve();
const fileGroupPath = path.join(__dirname, './data/group.json');

// Retrieve group on group
function getGroup(req, resp) {
  if (req.user.role === 'ADMIN') {
    const groupData = getGroupData();
    resp.status(200).json(groupData);
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
}

// Retrieve a group by  it's groupname using the req.query method
function getGroupByGroupName(req, resp) {
  if (req.user.role === 'ADMIN') {
    const groupData = getGroupData();
    const groupByGroupName = groupData.find((group) => (group.groupName.toLowerCase()).includes(req.query.groupName.toLowerCase()));
    // "The .toLowerCase() method is used to change a string to lowercase."
    if (!groupByGroupName) {
      resp.status(400).json({ msg: 'Cannot found group for groupName' });
    } else {
      resp.status(200).json(groupByGroupName);
    }
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
};
// Retrieve a group by age using the req.query method
function getGroupByAge(req, resp) {
  if (req.user.role === 'ADMIN') {
    const groupData = getGroupData();
    const groupByAge = groupData.find((group) => group.fromAge <= req.query.age && req.query.age <= group.toAge);
    if (!groupByAge) {
      return resp.status(400).json({ msg: 'Cannot found group for groupAge' });
    }
    resp.status(200).json(groupByAge);
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
};
// Retrieve a group by it's groupID using the req.query method
function getGroupByGroupId(req, resp) {
  if (req.user.role === 'ADMIN') {
    const groupData = getGroupData();
    const groupByGroupId = groupData.find((group) => group.groupId.toString() === req.query.groupId);
    if (!groupByGroupId) {
      resp.status(400).json({ msg: 'Cannot found group for groupId' });
    } else {
      resp.status(200).json(groupByGroupId);
    }
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  }
};

// Create group
function createGroup(req, resp) {
  const groupData = getGroupData();
  if (req.user.role === 'ADMIN') {
    if (!groupData && groupData instanceof Array === false) {
      return resp.status(500).json({ msg: 'Something went wrong' });
    }
    const newGroup = req.body;
    // Check each properties in Object have value yet
    try {
      validatePropertiesGroup(newGroup);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // Check duplicated groupName
    try {
      validateDuplicateGroup(groupData, newGroup);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
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
};

// update group by groupId
function updateGroupByGroupId(req, resp) {
  const groupData = getGroupData();
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
    try {
      validatePropertiesGroup(newGroupUpDate);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // Check duplicated groupName
    try {
      validateDuplicateGroup(groupData, newGroupUpDate);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    newGroupUpDate.groupId = Number(req.params.groupId);
    groupData[indexGroup] = newGroupUpDate;
    writeFile(fileGroupPath, groupData);
    resp.status(200).json({ data: newGroupUpDate, msg: 'UpDate group successful' });
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  };
}

// Delete a group by its group ID
function deleteGroupByGroupId(req, resp) {
  const groupData = getGroupData();
  if (req.user.role === 'ADMIN') {
    if (!groupData) {
      resp.status(500).json({ msg: 'Something went wrong' });
    }
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
};

export default { getGroup, getGroupByGroupName, getGroupByAge, getGroupByGroupId, createGroup, updateGroupByGroupId, deleteGroupByGroupId };
