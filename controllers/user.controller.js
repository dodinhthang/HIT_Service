var User = require('../models/user.model');
var bcrypt = require('bcrypt');
var request = require('request');
const saltRounds = 10;
var config = require('config');
//Dang ki
exports.SignUp = (req, res) => {
    console.log(req.body)
    if (req.body) {
        User.findOne({
            $or: [{ 'phone': req.body.phone }, { 'studentId': req.body.studentId }]
        }).then(async student => {
            if (student) {
                res.json({
                    code:2,
                    status: "400",
                    message: "Đã tồn tại tài khoản"
                });
            } else {
                if (!req.body.phone || !req.body.studentId || req.body.phone.lenght > 11 || req.body.phone.lenght < 10) {
                    res.json({
                        code:2,
                        status: "400",
                        message: "Thông tin tài khoảng trống "
                    });
                }

                let pk = await bcrypt.hash(req.body.pass, saltRounds);
                var user = new User({
                    phone: req.body.phone,
                    studentId: req.body.studentId,
                    pass: pk,
                    birthDate: new Date(req.body.birthDate),
                    from: req.body.from,
                    name: req.body.name,
                    email: req.body.email
                });

                user.save().then(result => {
                    res.json({
                        code:1,
                        status: "201",
                        message: "Thêm tài khoản thành công!",
                        user: user
                    });
                }).catch(err => {
                    // console.log(err);
                    res.json({
                        code:2,
                        status: "400",
                        message: "Lỗi tạo tài khoản không thành công"
                    });
                })
            }
        }).catch(err => {
            res.json({
                code:2,
                status: "400",
                message: "Lỗi tạo tài khoản"
            });
        });
    }
}
//Kiem tra dang nhap
exports.Check = (req, res) => {
    res.json({ code: config.get('state.success'), message: "Thanh cong" });
}
exports.CheckSignUp = (req,res)=>{
    request.post({
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        url: 'https://dttc.haui.edu.vn/vn/s/sinh-vien/bang-da-dong?action=p1&p=1&ps=50&exp=FeeTypeName&dir=1',
        body: 's=' + req.params.sid
    }, function (error, response, body) {
        if (response.statusCode != 200) {
            res.json({
                code: config.CODE_ERR_WITH_MESS,
                message: 'Error with student id'
            });
            return;
        }
        var tableIndex = body.indexOf("<table ");
        var subcontent = body.substring(0, tableIndex).replace(/&nbsp;/g, '').replace(/\r\n/g, '').replace(/<b class="sName">/g, '').replace(/<\/b>/g, ',');
        subcontent = '{"' + subcontent.replace(/.$/, '"}');
        subcontent = subcontent.replace(/:/g, '":"').replace(/,/g, '","');
        subcontent = subcontent.replace(/"\s+/g, '"').replace(/\s+"/g, '"');
        subcontent = subcontent.replace('Họ và tên', 'name').replace('Lớp', 'class').replace('Khóa', 'group');
        var obj = {};
        try {
            obj = JSON.parse(subcontent);
            console.log(obj);
            res.json({
                code: config.CODE_OK_WITH_MESS,
                data: obj
            });
            return;

        } catch (err) {
            res.json({
                code: config.CODE_ERR_WITH_MESS,
                message: 'Error: ' + err
            });
            return;
        }
    });
}

exports.GetUsers =async (req,res)=>{
    var page = req.query.page ? parseInt(req.query.page) : 1
    var limit = req.query.limit ?parseInt(req.query.limit): 10; 
    let query  = {
        role:'user'
    };
        if(req.query.filter=='false'){
            query.playId = { $exists: false };
        }
        if(req.query.filter=='true'){
            query.playId = { $exists: true, $ne: null };
        }
    
    var options = {
        page,
        limit,
        populate: 'playId' ,
    }
    try {
        var users = await User.paginate(query, options);
        res.json({
            code: 1,
            status: "200",
            data:users
        })

    } catch (e) {
        console.log(e)
       res.json({
        code:2,
        status: "400",
        message: "Lấy người dùng thất bại"
       })
    }
}

exports.GetUserInter =async (req,res)=>{
    var page = req.query.page ? parseInt(req.query.page) : 1
    var limit = req.query.limit ?parseInt(req.query.limit): 10; 
    let query  = {
        role:'user'
    };
    
    var options = {
        page,
        limit,
        populate: 'playId' ,
    }
    try {
        var users = await User.paginate(query, options);
        // console.log(users)
       users.docs =  users.docs.filter(item=>{
            if(item.playId){
                if(item.playId.isInterviewing==0||item.playId.isInterviewing==1)
                    return true;
            }
        });
        res.json({
            code: 1,
            status: "200",
            data:users
        })

    } catch (e) {
        console.log(e)
       res.json({
        code:2,
        status: "400",
        message: "Lấy người dùng thất bại"
       })
    }
}

exports.GetAdmins =async (req,res)=>{
    try {
        var users = await User.find({$or:[{role:'admin'},{role:'judge'}]});
        
        res.json({
            code: 1,
            status: "200",
            data:users
        })

    } catch (e) {
        console.log(e)
       res.json({
        code:2,
        status: "400",
        message: "Lấy người dùng thất bại"
       })
    }
}

exports.UpdateUser = async (req,res)=>{
    let body = req.body;
    if(body){
        let user = await User.findOne({studentId:body.studentId});
        if(user){
            user.name = body.name;
            user.studentId = body.studentId;
            user.phone = body.phone;
            user.class = body.class;
            user.group = body.group;
            user.isLocked = body.isLocked;
            user.birthDate = body.birthDate;
            user.from = body.from;
            user.role = body.role;
            user.email = body.email;
            try{
                let u=   await user.save();
                res.json({
                    code:1,
                    status:'200',
                    user :u
                });
            }catch(e){
                throw e;
                res.json({
                    code:2,
                    status:'400',
                    message:'Cập nhập thông tin người dùng thất bại.'
                });
            }
        }
    }
}
exports.DeleteUser = async (req,res)=>{
    let body = req.params;
    // console.log(body)
    if(body){
        let user = null;
        try{
            user = await User.findOne({studentId:body.studentId});
        }
        catch(err){
            res.json({
                code:2,
                status:'400',
                message:'Không tìm thấy người dùng.'
            });
        }
        // console.log(req.decoded)
        if(user&&body.studentId!=req.decoded.studentId){
            try{
                user.remove();
                res.json({
                    code:1,
                    status:'200',
                    message:'Xóa người dùng thành công'
                });
            }catch(e){
                res.json({
                    code:2,
                    status:'400',
                    message:'Xóa người dùng thất bại.'
                });
            }
        }else{
            res.json({
                code:2,
                status:'400',
                message:'Bạn không thể xóa người dùng này'
            });
        }
    }
}
exports.Lock = async (req,res)=>{
    let studentId =  req.params.studentId;
    if(studentId){
        let user = null;
        try{
            user = await User.findOne({studentId:studentId});
        }
        catch(err){
            res.json({
                code:2,
                status:'400',
                message:'Không tìm thấy người dùng.'
            });
        }
        if(user&&studentId!=req.decoded.studentId){
            try{
                user.isLocked = !user.isLocked;
                user.save();
                res.json({
                    code:1,
                    status:'200',
                    message:'Thay đổi trạng thái người dùng thành công'
                });
            }catch(e){
                res.json({
                    code:2,
                    status:'400',
                    message:'Thay đổi trạng thái người dùng thất bại.'
                });
            }
        }else{
            res.json({
                code:2,
                status:'400',
                message:'Bạn không thể thay đổi trạng thái người dùng này'
            });
        }
    }
}
exports.GetUserById = async(req,res)=>{
    let studentId =  req.params.studentId;
    if(studentId){
        let user = null;
        try{
            user = await User.findOne({studentId:studentId});
        }
        catch(err){
            res.json({
                code:2,
                status:'400',
                message:'Không tìm thấy người dùng.'
            });
        }
        if(user&&studentId!=req.decoded.studentId){
            try{
                
                res.json({
                    code:1,
                    status:'200',
                    user:user
                });
            }catch(e){
                res.json({
                    code:2,
                    status:'400',
                    message:'Thay đổi trạng thái người dùng thất bại.'
                });
            }
        }else{
            res.json({
                code:2,
                status:'400',
                message:'Bạn không thể thay đổi trạng thái người dùng này'
            });
        }
    }
}
