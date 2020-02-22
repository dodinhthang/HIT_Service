const Question = require('../models/question.model');
const QuestionList = require('../models/questionList.model');

exports.GetRandomQuestion = async () => {
    try {
        let listQ = await QuestionList.find();
        let listP = [];
        let dem = 0;
        if (listQ != null) {
            await listQ.forEach(list => {
                let arr = GetArrRandom(list.usingQuestion, list.questions.length);
                for (let i = 0; i < list.usingQuestion; i++) {
                    listP.push({
                        questionId: list.questions[arr[i]].questId,
                        answered: false
                    });
                }
            });
        }
        return listP;
    } catch (err) {
        return null;
    }
}
let GetArrRandom = (useQues, count) => {
    try {
        let arr = [];
        while (arr.length < useQues) {
            let length = arr.length;
            let number = Math.floor((Math.random() * count) + 1);
            if (length == 0) {
                arr.push(number - 1);
            } else {
                let dem = 0;
                for (let i = 0; i < length; i++) {
                    if ((number - 1) != arr[i]) {
                        dem++;
                    }
                }
                if (dem == length) {
                    arr.push(number - 1);
                }
            }
        }
        return arr;
    } catch (err) {
        return null;
    }
}
exports.GetQuestions = async (req, res) => {
    var page = req.query.page ? parseInt(req.query.page) : 1
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;

    var options = {
        page,
        limit,
    }
    try {
        var question = await Question.paginate({}, options);
        res.json({
            code: 1,
            status: "200",
            data: question
        })

    } catch (e) {
        console.log(e)
        res.json({
            code: 2,
            status: "400",
            message: "Lấy  câu hỏi thất bại"
        })
    }
}
exports.GetQuestionsNotPage = async (req, res) => {
    try {
        var question = await Question.find();
        res.json({
            code: 1,
            status: "200",
            data: question
        })

    } catch (e) {
        res.json({
            code: 2,
            status: "400",
            message: "Lấy  câu hỏi thất bại"
        })
    }
}

exports.GetQuestionById = async (req, res) => {
    let id = req.params.id;
    if (id) {
        try {
            let question = await Question.findById(id);
            res.json({
                code: 1,
                status: '200',
                data: question
            });

        } catch (err) {
            res.json({
                code: 2,
                status: '400',
                message: 'Lỗi không tìm thấy câu hỏi'
            });
        }
    } else {
        res.json({
            code: 2,
            status: '400',
            message: 'Lỗi không tìm thấy câu hỏi'
        });
    }
}

exports.AddQuestion = async (req, res) => {
    let body = req.body;
    // console.log(req.body)
    if (body) {
        try {
            // console.log(body.answered1)
            let question = new Question({
                content: body.content,
                isHtml: body.isHtml,
                options: [{
                        numbering: 'A',
                        answer: body.answered1.trim()
                    },
                    {
                        numbering: 'B',
                        answer: body.answered2.trim()
                    },
                    {
                        numbering: 'C',
                        answer: body.answered3.trim()
                    },
                    {
                        numbering: 'D',
                        answer: body.answered4.trim()
                    }
                ],
                correctAnswer: body.correctAnswer.trim(),
                score: body.score
            });
            // console.log(question)
            let result = await question.save();
            res.json({
                code: 1,
                status: '200',
                data: result
            })
        } catch (err) {
            res.json({
                code: 2,
                status: '400',
                message: 'Thêm mới câu hỏi thất bại.'
            });
        }
    }
}

exports.Delete = async (req, res) => {
    let id = req.params.id;
    if (id) {
        try {
            await Question.findByIdAndRemove(id);
            res.json({
                code: 1,
                status: '200',
                message: 'Xóa câu hỏi thành công'
            });
        } catch (err) {
            console.log(err)
            res.json({
                code: 2,
                status: '400',
                message: 'Xóa câu hỏi thất bại.'
            })
        }
    }
}

exports.Update = async (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (id && body) {
        let question = undefined;
        try {
            question = await Question.findById(id);
        } catch (err) {
            res.json({
                code: 1,
                status: '400',
                message: 'Không tìm thấy câu hỏi'
            });
        }
        if (question) {
            try {
                question.content = body.content;
                // question.image = body.image;
                // question.video = body.video;
                // questions.isHtml = body.isHtml;
                question.options[0].answer = body.answered1.trim();
                question.options[1].answer = body.answered2.trim();
                question.options[2].answer = body.answered3.trim();
                question.options[3].answer = body.answered4.trim();
                question.correctAnswer = body.correctAnswer.trim();
                question.score = body.score;
                let result = await question.save();
                res.json({
                    code: 1,
                    status: '200',
                    data: result
                });
            } catch (err) {
                res.json({
                    code: 1,
                    status: '400',
                    message: 'Cập nhập câu hỏi thất bại'
                });
            }
        }
    }
}
