/* eslint-disable no-case-declarations */
import path from 'path';
import { readFile, writeFile } from '../../utils/fileIO.js';
import { getWeekData } from '../week/week.service.js';
const __dirname = path.resolve();
const fileQuestionPath = path.join(__dirname, './data/question.json');
const questionData = getQuestionData();
const weekData = getWeekData();

// Điều này tạo ra đường dẫn tới tệp data.json trong cùng thư mục với tệp mã nguồn của bạn.

export function getQuestionData() {
  const questionData = readFile(fileQuestionPath);
  return questionData;
}

export function createMultipleYNQuiz(newQuestion) {
  // kiểm tra nội dung câu hỏi
  validateQuestion(newQuestion);
  // kiểm tra keys của subQuestion và Answer có bằng nhau ko
  validateSubQuestionAndAnswerKeys(newQuestion);
  // kiểm tra answer của MultipleYNQuiz
  validateAnswerMultipleYNQuiz(newQuestion);
  // cập nhật dữ liệu questionData
  updateQuestionData(newQuestion);
  return newQuestion;
};

export function createSingleYNQuiz(newQuestion) {
  // kiểm tra nội dung câu hỏi
  validateQuestion(newQuestion);
  // kiểm tra keys của subQuestion và Answer có bằng nhau ko
  validateSubQuestionAndAnswerKeys(newQuestion);
  // kiểm tra answer của SingleYNQuiz
  validateAnswerSingleYNQuiz(newQuestion);
  // cập nhật dữ liệu questionData
  updateQuestionData(newQuestion);
  return newQuestion;
};

export function createSingleSelectQuiz(newQuestion) {
  // kiểm tra nội dung câu hỏi
  validateQuestion(newQuestion);
  // kiểm tra keys của subQuestion và Answer có bằng nhau ko
  validateSubQuestionAndAnswerKeys(newQuestion);
  // kiểm tra answer của SingleSelectQuiz
  validateAnswerSingleSelectQuiz(newQuestion);
  // cập nhật dữ liệu questionData
  updateQuestionData(newQuestion);
  return newQuestion;
}

export function createMutipleSelectQuiz(newQuestion) {
  // kiểm tra nội dung câu hỏi
  validateQuestion(newQuestion);
  // kiểm tra keys của subQuestion và Answer có bằng nhau ko
  validateSubQuestionAndAnswerKeys(newQuestion);
  // kiểm tra answer của MultipleSelectQuiz
  validateAnswerMutipleSelectQuiz(newQuestion);
  // cập nhật dữ liệu questionData
  updateQuestionData(newQuestion);
  return newQuestion;
};

export function createImageQuiz(newQuestion) {
  // kiểm tra nội dung câu hỏi
  validateQuestion(newQuestion);
  // kiểm tra keys của subQuestion và Answer có bằng nhau ko
  validateSubQuestionAndAnswerKeys(newQuestion);
  // kiểm tra answer của imageQuiz
  validateImageQuiz(newQuestion);
  // cập nhật dữ liệu questionData
  updateQuestionData(newQuestion);
  return newQuestion;
};

export function createBlankQuiz(newQuestion) {
  validateExistWeekNo(newQuestion);
  // kiểm tra số loại dữ liệu của data có phù hợp ko (tạo hàm validate)
  validatePropertiesQuestion(newQuestion);
  // kiểm tra kết quả có khớp với câu hỏi hay không
  validateAnswerAndQuestionBlank(newQuestion);
  // kiểm tra cái quizNo của cái tuần weekNo có tồn tại hay chưa
  validaterDuplicateQuizNo(newQuestion, questionData);
  // kiểm tra answer của BankQuiz
  validateAnswerBlankQuiz(newQuestion);
  // cập nhật dữ liệu questionData
  updateQuestionData(newQuestion);
  return newQuestion;
};

export function createCrossWordQuiz(newQuestion) {
  // kiểm tra nội dung câu hỏi
  validateQuestion(newQuestion);
  // kiểm tra keys của subQuestion và Answer có bằng nhau ko
  validateSubQuestionAndAnswerKeys(newQuestion);
  // kiểm tra answer của CrossWordQuiz
  validateCrossWordQuiz(newQuestion);
  // tạo câu hỏi theo direction của question
  createCrossWordQuizBySubQuestion(newQuestion);
  // cập nhật dữ liệu questionData
  updateQuestionData(newQuestion);
  return newQuestion;
};

export function validateAnswerMultipleYNQuiz(newQuestion) {
  const answerArray = Object.values(newQuestion.answer);
  const trueAnswers = answerArray.filter(item => item.isAnswer === true);
  if (trueAnswers.length < 2) {
    throw Error('Wrong input answer');
  }
}

export function validateAnswerSingleYNQuiz(newQuestion) {
  const answerArray = Object.values(newQuestion.answer);
  const trueAnswers = answerArray.filter(item => item.isAnswer === true);
  if (trueAnswers.length !== 1) {
    throw Error('Wrong input answer');
  }
}

export function validateAnswerSingleSelectQuiz(newQuestion) {
  const answerArray = Object.values(newQuestion.answer);
  const trueAnswers = answerArray.filter(item => item.isAnswer === true);
  if (trueAnswers.length !== 1) {
    throw Error('Wrong input answer');
  }
}

export function validateAnswerMutipleSelectQuiz(newQuestion) {
  const answerArray = Object.values(newQuestion.answer);
  const trueAnswers = answerArray.filter(item => item.isAnswer === true);
  if (trueAnswers.length < 1 && trueAnswers.length > newQuestion.answer.length) {
    throw Error('Wrong input answer');
  }
}

export function validateImageQuiz(newQuestion) {
  const answerArray = Object.values(newQuestion.answer);
  const trueAnswers = answerArray.filter(item => item.isAnswer === true);
  if (trueAnswers.length !== 1 || !newQuestion.imageUrl) {
    throw Error('Wrong input answer');
  }
}

export function validateAnswerBlankQuiz(newQuestion) {
  const answerArray = Object.values(newQuestion.answer);
  const trueAnswers = answerArray.filter(item => item.isAnswer === true);
  const lengthSubQuestionBlank = Object.keys(newQuestion.subQuestion).length;
  if (trueAnswers.length !== lengthSubQuestionBlank - 1) {
    throw Error('Wrong input answer');
  }
}

export function validateCrossWordQuiz(newQuestion) {
  const answerArray = Object.values(newQuestion.answer);
  const trueAnswers = answerArray.filter(item => item.isAnswer === true);
  const lengthSubQuestionCross = Object.keys(newQuestion.subQuestion).length;
  const lengthBibleVerseCross = Object.keys(newQuestion.bibleVerse).length;

  if (trueAnswers.length !== lengthSubQuestionCross || lengthBibleVerseCross !== trueAnswers.length) {
    throw Error('Wrong input answer, subQuestion or bibleVerse');
  }
  if (!newQuestion.quiz) {
    throw Error('Wrong input quiz of newQuestion');
  }
  for (let i = 0; i < newQuestion.quiz.length; i++) {
    if (newQuestion.quiz.length !== newQuestion.quiz[i].length) {
      throw Error('Wrong input quiz of ');
    }
  }
}

function createCrossWordQuizBySubQuestion(newQuestion) {
  const subQuestionQuiz = newQuestion.subQuestion;
  const answerQuiz = newQuestion.answer;
  const keysArray = Object.keys(subQuestionQuiz);
  // const valuesArray = Object.values(subQuestionQuiz);
  for (const key of keysArray) {
    // lấy direction của subquestion để đem so sánh đáp án
    // add endingPoint
    switch (subQuestionQuiz[key].direction) {
      case 'horizontal':
        const quizSpliced = newQuestion.quiz[subQuestionQuiz[key].startingPoint.y];
        const quizHorSliced = quizSpliced.slice(subQuestionQuiz[key].startingPoint.x + 1, newQuestion.quiz.length + 1);
        console.log('quizSlicedHor', quizHorSliced);
        // Slice quizHorSliced theo độ dài của text trong answer.
        const lengthTextAnswerHor = answerQuiz[key].text.length;
        const quizSliceFinal = quizHorSliced.slice(subQuestionQuiz[key].startingPoint.x, lengthTextAnswerHor);
        console.log(quizSliceFinal.join(''));
        console.log(answerQuiz[key].text.toUpperCase());
        // compare quiz and answer
        const isMatch = answerQuiz[key].text.toUpperCase().includes((quizSliceFinal.join('')).toUpperCase());
        console.log(isMatch);
        if (!isMatch) {
          throw Error('Wrong input answer of quiz');
        }
        break;
      case 'vertical':
        const quizSlicedVer = [];
        console.log('testquiz', newQuestion.quiz);
        for (let i = 0; i < newQuestion.quiz.length; i++) {
          const itemSliced = newQuestion.quiz[i].slice(subQuestionQuiz[key].startingPoint.x, subQuestionQuiz[key].startingPoint.x + 1);
          quizSlicedVer.push(itemSliced);
        }
        console.log('testquizSlicedVer', quizSlicedVer);
        quizSlicedVer.splice(subQuestionQuiz[key].startingPoint.y, 1);
        // Slice quizSplicedVer theo độ dài của text trong answer.
        const lengthTextAnswerVer = answerQuiz[key].text.length;
        const quizSpliceFN = quizSlicedVer.slice(subQuestionQuiz[key].startingPoint.y, lengthTextAnswerVer);
        console.log(quizSpliceFN.join(''));
        console.log(answerQuiz[key].text.toUpperCase());
        const isMatchVer = answerQuiz[key].text.toUpperCase().includes((quizSpliceFN.join('')).toUpperCase());
        console.log(isMatchVer);
        if (!isMatchVer) {
          throw Error('Wrong input answer of quiz');
        }
        break;
    }
  }
  // return result;
}

export function validateSubQuestionAndAnswerKeys(newQuestion) {
  const subQuestionString = Object.keys(newQuestion.subQuestion).join();
  const answerString = Object.keys(newQuestion.answer).join();
  if (subQuestionString !== answerString) {
    throw Error('Wrong input key of subQuestion or answer');
  }
}

export function validateExistWeekNo(newQuestion) {
  const weekQuiz = weekData.find((week) => week.weekNo === Number(newQuestion.weekNo));
  if (!weekQuiz) {
    throw Error('Cannot found week by weekNo');
  }
}

export function validatePropertiesQuestion(newQuestion) {
  if (newQuestion instanceof Object === false) {
    throw Error('Can not validated question properties');
  }
  if (!newQuestion.weekNo || !newQuestion.quizType || !newQuestion.mainQuestion || !newQuestion.subQuestion || !newQuestion.answer || !newQuestion.bibleVerse) {
    throw Error('Please fill in all required information');
  }
}

export function validateAnswerAndQuestion(newQuestion) {
  if (Object.keys(newQuestion.subQuestion).length !== Object.keys(newQuestion.answer).length || Object.keys(newQuestion.subQuestion).length < 0 || Object.keys(newQuestion.bibleVerse).length < 0) {
    throw Error('Wrong input subQuestion and answer quiz');
  }
}
export function validateAnswerAndQuestionBlank(newQuestion) {
  const lengthSubQuestionBlank = Object.keys(newQuestion.subQuestion).length;
  const lengthAnswerBlank = Object.keys(newQuestion.answer).length;
  if (lengthAnswerBlank !== lengthSubQuestionBlank - 1 || Object.keys(newQuestion.subQuestion).length < 0 || Object.keys(newQuestion.bibleVerse).length < 0) {
    throw Error('Wrong input subQuestion and answer quiz');
  }
}

export function validaterDuplicateQuizNo(newQuestion, questionData) {
  if (newQuestion instanceof Object === false) {
    throw Error('Can not validated question quizNo duplicate');
  }
  const duplicatedQuestionQuizNo = questionData.find((question) => question.quizNo === Number(newQuestion.quizNo));
  if (duplicatedQuestionQuizNo) {
    throw Error('Duplicate question quizNo');
  }
}

export function validateQuestion(newQuestion) {
  // kiểm tra weekNo có tồn tại ko
  validateExistWeekNo(newQuestion);
  // kiểm tra số loại dữ liệu của data có phù hợp ko (tạo hàm validate)
  validatePropertiesQuestion(newQuestion);
  // kiểm tra kết quả có khớp với câu hỏi hay không
  validateAnswerAndQuestion(newQuestion);
  // kiểm tra cái quizNo của cái tuần weekNo có tồn tại hay chưa
  validaterDuplicateQuizNo(newQuestion, questionData);
}

export function updateQuestionData(newQuestion) {
  // tăng id của question lên 1
  const nextQuizId = getNextQuestionId(questionData);
  newQuestion.quizId = nextQuizId;
  // lưu lại data
  questionData.push(newQuestion);
  writeFile(fileQuestionPath, questionData);
  // return lại data
  return newQuestion;
}

export function getNextQuestionId(data) {
  if (data instanceof Array === true) {
    const lastQuestion = data[data.length - 1];
    const nextId = lastQuestion.quizId + 1;
    return nextId;
  } else {
    throw Error('Can not get next id ');
  }
}
