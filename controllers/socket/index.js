const CONST = require('../../config/config');
var index = function(socket) {
  socket.emit(CONST.NAMESPACE.LOGIN, { message: 'welcome to socket server' }); //when socket connect
  socket.on(CONST.NAMESPACE.LOGIN, require('./start.js')(socket));
  socket.on(CONST.NAMESPACE.DISCONNECT, require('./disconect')(socket));
  socket.on(CONST.NAMESPACE.QUESTION, require('./question')(socket));
  socket.on(CONST.NAMESPACE.INTERVIEW, require('./interview')(socket));
};

module.exports = index;
