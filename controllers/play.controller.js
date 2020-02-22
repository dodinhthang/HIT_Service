const ProController = require('./problem.controller');
const QuesController = require('./question.controller');
const Play = require('../models/play.model');
const User = require('../models/user.model');
exports.GetPlay =  (req, res) => {
    let body = req.body;
    if (body) {
         User.findOne({studentId:body.studentId}).then(user=>{
             if(user&&user.role=="user"){
                Play.findOne({userID:user._id}).populate('history.questions.questionId','options content').populate('history.problems.problemId').then(async resultplay=>{
                    if(resultplay){
                        res.json({
                            code: 2,
                            status: "400",
                            mesange: "Tiếp tục",
                            data:resultplay
                        })
                    }else{
                      
                        let play = new Play({
                            userID: user._id,
                            history: {
                                questions:await QuesController.GetRandomQuestion(),
                                problems:await ProController.GetRandomProblem(),
                            }
                        });
                        play.save().then(async (result) => {
                            
                            let playadd = await Play.findById(result._id).populate('history.questions.questionId','options content').populate('history.problems.problemId');
                            user.playId = result._id;
                            await user.save();
                            res.json({
                                code: 1,
                                status: "200",
                                mesange: "Bắt đầu thành công",
                                data:playadd
                            });
                        }).catch((err) => {
                            res.json({
                                code: 2,
                                status: "400",
                                mesange: "Bắt đầu thất bại"
                            })
                        });
                    }
                }).catch(err=>{
                    console.log(err)
                    res.json({
                        code: 2,
                        status: "400",
                        mesange: "Bắt đầu thất bại"
                    })
                })
             }else{
                res.json({
                    code: 2,
                    status: "400",
                    mesange: "Không tìm thấy sinh viên "
                })
             }
         }).catch(err=>{
            res.json({
                code: 2,
                status: "400",
                mesange: "Không tìm thấy sinh viên "
            })
         })
        
    }

}
