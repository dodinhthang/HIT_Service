const CONST = require('../../config/config');
const User = require('../../models/user.model');
const Play = require('../../models/play.model');
module.exports = function(socket) {
  return function(data) {
    if (data.command === 1000) {
      User.findOne({ studentId: data.studentId }).then(user => {
        Play.findById(user.playId).then(play => {
          play.isInterviewing = 1;
          play.save();
        });
      });
      socket.broadcast.emit(CONST.NAMESPACE.INTERVIEW, { command: 1000, studentId: data.studentId });
    }
    if(data.command==1){
        User.findOne({ studentId: data.studentId }).then(user => {
            Play.findById(user.playId).then(play => {
              play.isInterviewing = 2;
              play.interviewScore = data.interviewResult.score;
              play.comment =data.interviewResult.content;
              play.judgeName = data.interviewResult.judgeName;
              play.totalScore = parseInt(data.interviewResult.score)+parseInt( play.totalScore);
              play.save();
            });
          });
          socket.broadcast.emit(CONST.NAMESPACE.INTERVIEW, { command: 1, studentId: data.studentId });
    }
    if(data.command==0){
        User.findOne({ studentId: data.studentId }).then(user => {
            Play.findById(user.playId).then(play => {
              play.isInterviewing = 0;
              play.save();
            });
          });
          socket.broadcast.emit(CONST.NAMESPACE.INTERVIEW, { command: 0, studentId: data.studentId });
    }
  };
};
