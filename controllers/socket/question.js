const config = require('config');
const CONST = require('../../config/config');
const Play = require('../../models/play.model');
const PlayController = require('../play.controller');
const User = require('../../models/user.model');
//defind 1000 choose 
module.exports = function (socket) {
    return function (data) {
        if (data.comand == 1000) {
            let play = data.data;

            Play.findById(play._id).then(async result => {
                let playFull = await Play.findById(play._id).populate('history.questions.questionId').populate('history.problems.problemId');
                // console.log(playFull)
                result.time = play.time;
                let score = 0;
                for (let i = 0; i < play.history.questions.length; i++) {
                    if (play.history.questions[i].answer == playFull.history.questions[i].questionId.correctAnswer) {

                        result.history.questions[i].answer = playFull.history.questions[i].questionId.correctAnswer;
                        score += playFull.history.questions[i].questionId.score;

                    } else {

                        result.history.questions[i].answer = play.history.questions[i].answer;
                    }
                    if (play.history.questions[i].answer != undefined) {

                        result.history.questions[i].answered = true;
                    }
                }
                for (let i = 0; i < play.history.problems.length; i++) {
                    if (play.history.problems[i].correct == true) {
                        score += parseInt(play.history.problems[i].problemId.correctScore);
                    }
                }
                result.totalScore = score;
                result.save().then(resultend => {
                    User.findById(play.userID).then(user => {
                        if (user && user.role == "user") {
                            Play.findOne({
                                userID: user._id
                            }).populate('history.questions.questionId', 'options content').populate('history.problems.problemId').then(async resultplay => {
                                if (resultplay) {
                                    var ques = {
                                        code: 2,
                                        status: "400",
                                        mesange: "Tiếp tục",
                                        data: resultplay
                                    };
                                    if (global.hshUserSocket.hasOwnProperty(user._id)) {

                                        const socketid = global.hshUserSocket[user._id];
                                        global.hshIdSocket[socketid].emit(CONST.NAMESPACE.QUESTION, ques);
                                        // socket.broadcast.emit(CONST.NAMESPACE.INTERVIEW, { command: 1000 });

                                    } else {
                                        console.log('Error, check user: ' + user._id);
                                    }
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        } else {
                            console.log('khong thay');
                        }
                    }).catch(err => {

                        console.log(err);
                    })
                })
            }).catch(err => {

            })
        }
        if (data.comand == 2000) {
            // console.log(data);
            let play = data.data;
            if (play) {
                Play.findById(play.data._id).then(result => {
                    result.time = data.time;
                    result.save();
                })
            }
        }
        if (data.comand == 3000) {
            User.findOne({
                studentId: data.studentId
            }).then(user => {
                Play.findOne({
                    userID: user._id
                }).then(play => {
                    play.status = 2;
                    play.save();
                    Play.findOne({
                        userID: user._id
                    }).populate('history.questions.questionId', 'options content').populate('history.problems.problemId').then(async resultplay => {
                        if (resultplay) {
                            var ques = {
                                code: 2,
                                status: "400",
                                mesange: "Tiếp tục",
                                data: resultplay
                            };
                            if (global.hshUserSocket.hasOwnProperty(user._id)) {

                                const socketid = global.hshUserSocket[user._id];
                                global.hshIdSocket[socketid].emit(CONST.NAMESPACE.QUESTION, ques);

                            } else {
                                console.log('Error, check user: ' + user._id);
                            }
                        }
                    })
                })
            })
        }
    }
}