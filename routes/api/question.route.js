const express = require('express');
const router = express.Router();
const auth = require('../../common/auth');
const checkRole = require('../../common/checkRole');
const QuestionController = require('../../controllers/question.controller');
router.get('/',auth,checkRole('admin'),QuestionController.GetQuestions);
router.get('/s',auth,checkRole('admin'),QuestionController.GetQuestions);
router.get('/all',auth,checkRole('admin'),QuestionController.GetQuestionsNotPage);
router.get('/:id',auth,checkRole('admin'),QuestionController.GetQuestionById);
router.put('/:id',auth,checkRole('admin'),QuestionController.Update);
router.delete('/:id',auth,checkRole('admin'),QuestionController.Delete);
router.post('/',auth,checkRole('admin'),QuestionController.AddQuestion);

module.exports = router;