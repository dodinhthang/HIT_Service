const config = require('config');
const User = require('../../models/user.model');
const CONST = require('../../config/config');


module.exports = function (socket) {
    return function (data) {
        if (global.hshSocketUser.hasOwnProperty(socket.id)) {
            const query = User.findById(global.hshSocketUser[socket.id]);
            query.then((user) => {
                    if (user) {
                        console.log(user.name + ', ' + user.studentId + ' gone offline');
                        user.isOnline = false;
                        if (user.role == 'user') {
                            global.userCount--;
                        }

                        socket.broadcast.emit(CONST.NAMESPACE.AUTH, {
                            command: CONST.RETURN.AUTH.DISCONNECT,
                            user: {
                                name: user.name,
                                studentId: user.studentId
                            }
                        });


                        if (global.hshIdSocket.hasOwnProperty(global.hshUserSocket[user._id])) {
                            delete global.hshIdSocket.hasOwnProperty(global.hshUserSocket[user._id]);
                        }

                        delete global.hshSocketUser[socket.id];
                        delete global.hshUserSocket[user._id];

                        return user.save();
                    }
                })
                .then(() => {
                    console.log(global.userCount + ' user online');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}