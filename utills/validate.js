export function validateDuplicateGroup(groupData, newGroup) {
  // Check duplicated groupName
  const duplicatedGroupName = groupData.find((group) => group.groupName === newGroup.groupName);
  if (!duplicatedGroupName) {
    // Check whether both fromAge and toAge conditions are met.
    let isDuplicateGroupAge = false;
    for (let i = 0; i < groupData.length; i++) {
      if (((newGroup.fromAge > 0 && newGroup.toAge < groupData[i].fromAge) || (newGroup.fromAge > groupData[i].toAge)) &&
        (newGroup.fromAge < newGroup.toAge)) {
        isDuplicateGroupAge = false;
      } else {
        throw Error('duplicated group age');
      }
    }
    return isDuplicateGroupAge;
  } else {
    throw Error('duplicated group name');
  }
}
