import path from 'path';
import { readFile, writeFile } from '../../utils/fileIO.js';
import { getWeekData } from '../week/week.service.js';
import { getNextId } from '../../utils/utils.js';
const __dirname = path.resolve();
const fileQuestionPath = path.join(__dirname, './data/question.json');
// Điều này tạo ra đường dẫn tới tệp data.json trong cùng thư mục với tệp mã nguồn của bạn.

export function getQuestionData() {
  const questionData = readFile(fileQuestionPath);
  return questionData;
}

export async function createMultipleYNQuiz(req, resp) {
  if (req.user.role === 'ADMIN') {
    // lấy data từ req.body ra
    const newQuestion = req.body;
    const weekData = getWeekData();
    const questionData = getQuestionData();
    // kiểm tra weekNo có tồn tại ko
    const week = weekData.find((question) => question.weekNo === Number(newQuestion.weekNo));
    if (!week) {
      resp.status(400).json({ msg: 'Cannot found week by weekNo' });
    }
    // kiểm tra số loại dữ liệu của data có phù hợp ko (tạo hàm validate)
    try {
      validatePropertiesQuestion(newQuestion);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // kiểm tra kết quả có khớp với câu hỏi hay không
    try {
      validateAnswerAndQuestion(newQuestion);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // kiểm tra cái quizNo của cái tuần weekNo có tồn tại hay chưa
    try {
      validaterQuizNoDuplicate(newQuestion);
    } catch (error) {
      return resp.status(400).json({ msg: error.message });
    }
    // tăng id của question lên 1
    const nextQuizId = getNextId(questionData);
    newQuestion.quizId = nextQuizId;
    // lưu lại data
    questionData.push(newQuestion);
    writeFile(fileQuestionPath, questionData);
    resp.status(200).json({ data: newQuestion, msg: 'Create new question successful' });
  } else {
    return resp.status(200).json({ msg: 'You don\'t have permission' });
  };
};
// return lại data

export function validaterQuizNoDuplicate(questionData, newQuestion) {
  if (newQuestion instanceof Object === true) {
    const duplicatedQuestionQuizNo = questionData.find((question) => question.quizNo === Number(newQuestion.quizNo));
    if (duplicatedQuestionQuizNo) {
      throw Error('Duplicate question quizNo');
    }
  } throw Error('Can not validated question quizNo duplicate');
}

export function validateAnswerAndQuestion(newQuestion) {
  if (newQuestion.subQuestion.length !== newQuestion.mainQuestion.length && newQuestion.subQuestion.length < 0 && newQuestion.bibleVerse.length < 0) {
    throw Error('Please fill in all required information');
  }
}

export function validatePropertiesQuestion(newQuestion) {
  if (newQuestion instanceof Object === true) {
    if (!newQuestion.weekNo || !newQuestion.quizType || !newQuestion.mainQuestion || !newQuestion.subQuestion || !newQuestion.answer || !newQuestion.bibleVerse) {
      throw Error('Please fill in all required information');
    }
  } throw Error('Can not validated question properties');
}

// export function validateStartTime(startTime) {
//   const currentDate = new Date().getTime();
//   if (currentDate > startTime) {
//     throw Error('Wrong input startTime');
//   }
// }
// export function validateEndTime(endTime) {
//   const currentDate = new Date().getTime();
//   if (currentDate > endTime) {
//     throw Error('Wrong input startTime');
//   }
// }
