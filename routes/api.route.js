var express = require('express')

var router = express.Router()
router.use('/user',require('./api/user.route'));
router.use('/auth',require('./api/session.route'));
router.use('/play',require('./api/play.route'));
router.use('/question',require('./api/question.route'));
router.use('/questionlist',require('./api/questionList.route'));
router.use('/problem',require('./api/problem.route'));

module.exports = router;