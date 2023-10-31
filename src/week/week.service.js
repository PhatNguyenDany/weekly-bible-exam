import path from 'path';
import { readFile } from '../../utils/fileIO.js';

// Điều này tạo ra đường dẫn tới tệp data.json trong cùng thư mục với tệp mã nguồn của bạn.

export function getWeekData() {
  const __dirname = path.resolve();
  const fileWeekPath = path.join(__dirname, './data/week.json');
  const weekData = readFile(fileWeekPath);
  return weekData;
}

export function validatePropertiesWeek(newWeek) {
  if (newWeek instanceof Object === true) {
    if (!newWeek.startTime || !newWeek.endTime || !newWeek.quizIds) {
      throw Error('Please fill in all required information');
    }
  } throw Error('Can not validated user properties');
}

export function validateStartTime(startTime) {
  const currentDate = new Date().getTime();
  if (currentDate > startTime) {
    throw Error('Wrong input startTime');
  }
}
export function validateEndTime(endTime) {
  const currentDate = new Date().getTime();
  if (currentDate > endTime) {
    throw Error('Wrong input startTime');
  }
}
