import moment from 'moment/moment.js';
import { checkDate } from './date.js';

export function computeUserAge(birthday) {
  const isDate = checkDate(birthday);
  if (isDate === false) {
    throw Error('Wrong birthday input');
  }
  const currentDate = moment();
  const age = currentDate.diff(moment(birthday, 'DD-MM-YYYY'), 'years');
  if (age <= 0) {
    throw Error('Cannot update user with age');
  }
  return age;
}

export function getGroupByAge(groupData, age) {
  if (groupData instanceof Array === true && age > 0) {
    const groupResult = groupData.find(groupItem => groupItem.fromAge <= age && age <= groupItem.toAge);
    if (!groupResult) {
      throw Error("Cannot found group for this user's age");
    }
    return groupResult;
  } else {
    console.error('groupData and age of function getGroupByAge are not array and number');
    throw Error('can not get group by age');
  }
}

export function getNextId(data) {
  if (data instanceof Array === true) {
    const lastUser = data[data.length - 1];
    const nextId = lastUser.id + 1;
    return nextId;
  } else {
    console.error('data function getNextID is not Array');
    throw Error('Can not get next id ');
  }
}
