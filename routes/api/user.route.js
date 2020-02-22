const express = require('express');
const router = express.Router();
var UserController = require('../../controllers/user.controller');
var auth = require('../../common/auth');
var checkRole = require('../../common/checkRole');
router.post('/add', UserController.SignUp);
router.get('/check', UserController.Check);
router.get('/checksignup/', UserController.CheckSignUp);
router.get('/', auth, checkRole('admin'), UserController.GetUsers);
router.get('/inter', auth, checkRole('judge'), UserController.GetUserInter);
router.get('/admin', auth, checkRole('admin'), UserController.GetAdmins);
router.put('/', auth, checkRole('admin'), UserController.UpdateUser);
router.delete('/:studentId', auth, checkRole('admin'), UserController.DeleteUser);
router.put('/:studentId', auth, checkRole('admin'), UserController.Lock);
router.get('/:studentId', auth, checkRole('admin'), UserController.GetUserById);

module.exports = router;
