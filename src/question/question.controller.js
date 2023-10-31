import { createBlankQuiz, createCrossWordQuiz, createImageQuiz, createMultipleYNQuiz, createMutipleSelectQuiz, createSingleSelectQuiz, createSingleYNQuiz, getQuestionData } from './question.service.js';
// Retrieve user on user
function getQuestion(req, resp) {
  if (req.user.role === 'ADMIN') {
    const questionData = getQuestionData();
    if (!questionData) {
      return resp.status(500).json({ msg: 'Something went wrong' });
    }
    return resp.status(200).json(questionData);
  } else {
    return resp.status(400).json({ msg: 'You don\'t have permission' });
  };
};

function createQuestion(req, resp) {
  if (req.user.role === 'ADMIN') {
    const newQuestion = req.body;
    let result = {};
    switch (newQuestion.quizType) {
      case 'multipleYesNo':
        result = createMultipleYNQuiz(newQuestion);
        break;
      case 'singleYesNo':
        result = createSingleYNQuiz(newQuestion);
        break;
      case 'singleSelect':
        result = createSingleSelectQuiz(newQuestion);
        break;
      case 'multipleSelect':
        result = createMutipleSelectQuiz(newQuestion);
        break;
      case 'image':
        result = createImageQuiz(newQuestion);
        break;
      case 'blank':
        result = createBlankQuiz(newQuestion);
        break;
      case 'crossword':
        result = createCrossWordQuiz(newQuestion);
        break;
    }
    resp.status(200).json({ msg: 'create question successful', data: result });
  } else {
    return resp.status(400).json({ msg: 'You don\'t have permission' });
  }
}

export default { getQuestion, createQuestion };
