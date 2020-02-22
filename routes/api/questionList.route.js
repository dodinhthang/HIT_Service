const express = require('express');
const router = express.Router();
const auth = require('../../common/auth');
const checkRole = require('../../common/checkRole');
const QuestionListController = require('../../controllers/questionList.controller');

router.get('/',auth,checkRole('admin'),QuestionListController.GetListQuestions);
router.post('/',auth,checkRole('admin'),QuestionListController.AddListQuestion);
router.put('/:id',auth,checkRole('admin'),QuestionListController.Update);
router.delete('/:id',auth,checkRole('admin'),QuestionListController.Delete);
router.get('/:id',auth,checkRole('admin'),QuestionListController.GetListQuestionById);

module.exports = router;