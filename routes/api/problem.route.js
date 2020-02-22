const express = require('express');
const router = express.Router();

const auth = require('../../common/auth');
const checkRole = require('../../common/checkRole');
const upload = require('../../common/upload');
const ProblemController = require('../../controllers/problem.controller');
router.get('/',auth,checkRole('admin'),ProblemController.GetProblems);
router.get('/s',auth,checkRole('admin'),ProblemController.GetQuestionsNotPage);
router.get('/:id',auth,checkRole('admin'),ProblemController.GetProblemById);
router.put('/:id',auth,checkRole('admin'),ProblemController.Update);
router.delete('/:id',auth,checkRole('admin'),ProblemController.Delete);
router.post('/',auth,checkRole('admin'),ProblemController.AddProblem);
router.post('/submit',auth,upload.uploadCode().single('file'),ProblemController.SubmitCode);
module.exports = router;