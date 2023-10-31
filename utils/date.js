// thêm thư viện vào file
import moment from 'moment/moment.js';

moment.suppressDeprecationWarnings = true;
// xuất function checkDate
export function checkDate(birthday) {
  const format = 'DD-MM-YYYY'; // Mẫu ngày
  const isValid = moment(birthday, format, true).isValid();
  if (isValid) {
    return true;
  } else {
    return false;
  }
}

export function changeTime(time) {
  const isDate = checkDate(time);
  if (isDate === false) {
    throw Error('Wrong birthday input');
  }
  const timeChange = moment(time, 'YYYY-MM-DD').getTime();
  return timeChange;
}
