const express = require('express');
const router = express.Router();
const Playcontroller = require('../../controllers/play.controller');
let auth = require('../../common/auth');
router.post('/',(req,res)=>{
    Playcontroller.GetPlay(req,res);
})

module.exports = router;
