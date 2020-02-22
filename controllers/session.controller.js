var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var config = require('config');
var bcrypt = require('bcrypt');
const saltRounds = 10;
exports.Login = (req, res) => {
    User.findOne({
        studentId: req.body.studentId
    }).then(async user => {
        if (!user) {
            res.json({
                code: config.get('state.false'),
                message: 'Authentication failed'
            });
        } else if (user) {
            // check if password matches
           let compare =bcrypt.compareSync(req.body.pass, user.pass);
            if (!user.pass || !compare) {
                res.json({
                    code: config.get('state.false'),
                    message: 'Authentication failed'
                });
            } else {

                if (user.isLocked) {
                    res.json({
                        code: config.get('state.false'),
                        message: 'User locked.'
                    }).end();
                    return;
                }
                if (user.isOnline) {
                    res.json({
                        code: config.get('state.false'),
                        message: 'User is online already'
                    });
                    return;
                }
                var info = {
                    _id: user._id,
                    secret: user.timePassChange
                };

                var token = jwt.sign(info, config.get('sercret'), {
                    expiresIn: "2d"
                });
                
                // user.isOnline = true;
                // user.save();
                res.status(201).json({
                    code: config.get('state.success'),
                    token: token,
                    user: {
                        name: user.name,
                        role: user.role,
                        studentId: user.studentId
                    }
                });
            }

        }
    }).catch(err => {
        console.log(err)
        res.json({
            code: config.get('state.false'),
            message: 'Lỗi'
        });
    })
}
