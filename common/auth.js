var User = require('../models/user.model'); // get our mongoose model
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('config'); // get our config file

module.exports = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.get('sercret'), function(err, decoded) {
      if (err) {
        res.json({
          code: config.get('state.false'),
          message: 'Failed to authenticate token.'
        });
        return;
      } else {
        // console.log(decoded)
        // if everything is good, save to request for use in other routes
        User.findOne(
          {
            _id: decoded._id
          },
          function(err, user) {
            if (err) console.log(err);
            if (!user) {
              res.json({
                code: config.get('state.false'),
                message: 'Authentication failed.'
              });
              return;
            } else if (user.isLocked) {
              res.json({
                code: config.get('state.false'),
                message: 'User is locked'
              });
              return;
            } else if (user) {
              req.decoded = {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                studentId: user.studentId,
                role: user.role
              };
              next();
            }
          }
        );
      }
    });
  } else {
    // if there is no token
    // return an error
    res
      .json({
        code: config.get('state.false'),

        message: 'Access denied'
      })
      .end();
  }
};
