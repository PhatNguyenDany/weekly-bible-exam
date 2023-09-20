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

export function validateDuplicateUsername(userData, newUser) {
  if (userData instanceof Array === true && newUser instanceof Object === true) {
    if (newUser.username.length > 5 && newUser.username.includes('@')) {
      const newUserUserNameDulicated = userData.find((user) => user.username.toString() === newUser.username);
      let isNewUserUserNameDuplicated = false;
      if (!newUserUserNameDulicated) {
        isNewUserUserNameDuplicated = false;
      } else {
        throw Error('Duplicated username of user');
      }
      return isNewUserUserNameDuplicated;
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
    let newUserPhoneDuplicated = false;
    if (indexNewUserPhoneDuplicated >= 0) {
      newUserPhoneDuplicated = false;
      throw Error('Duplicated phone user exist');
    }
    return newUserPhoneDuplicated;
  }
  throw Error('Can not validate user phonenumber');
}

export function validateUserGender(newUser) {
  if (newUser instanceof Object === true) {
    if (newUser.gender.toLowerCase() !== 'nam' && newUser.gender.toLowerCase() !== 'nu') {
      throw Error('Wrong user gender input');
    }
    return true;
  }
  throw Error('can not validated user gender');
}

export function validatePropertiesUser(newUser) {
  if (newUser instanceof Object === true) {
    if (!newUser.name || !newUser.birthday || !newUser.gender || !newUser.address || !newUser.phone || !newUser.username || !newUser.password) {
      throw Error('Please fill in all required information');
    } return true;
  } throw Error('Can not validated user properties');
}
