import path from 'path';
import { readFile } from '../../utils/fileIO.js';
// Điều này tạo ra đường dẫn tới tệp data.json trong cùng thư mục với tệp mã nguồn của bạn.

export function getGroupData() {
  const __dirname = path.resolve();
  const fileGroupPath = path.join(__dirname, './data/group.json');
  const groupData = readFile(fileGroupPath);
  return groupData;
}

export function validateDuplicateGroup(groupData, newGroup) {
  // Check duplicated groupName
  const duplicatedGroupName = groupData.find((group) => group.groupName === newGroup.groupName);
  if (!duplicatedGroupName) {
    // Check whether both fromAge and toAge conditions are met.
    for (let i = 0; i < groupData.length; i++) {
      if (newGroup.fromAge > 0 && newGroup.fromAge < newGroup.toAge) {
        if ((groupData[i].fromAge < newGroup.toAge < groupData[i].toAge) || (groupData[i].fromAge < newGroup.fromAge < groupData[i].toAge)) {
          throw Error('duplicated age input');
        }
      } else {
        throw Error('Wrong input fromAge or toAge');
      }
    }
  } else {
    throw Error('duplicated group name');
  }
}

export function validatePropertiesGroup(newGroup) {
  if (newGroup instanceof Object === true) {
    if (newGroup.groupName.length < 5) {
      throw Error('Please fill in enough characters for the groupname');
    }
    if (!newGroup.groupName || !newGroup.fromAge || !newGroup.toAge) {
      throw Error('Please fill in all required information');
    }
  } throw Error('Can not validated user properties');
};
