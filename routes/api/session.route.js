const express = require('express');
const router = express.Router();
var SessionController = require('../../controllers/session.controller');
router.post('/',(req,res)=>{
    SessionController.Login(req,res);
});

module.exports = router;
