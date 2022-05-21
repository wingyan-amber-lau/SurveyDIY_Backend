/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: Handles the necessary routes that functions with users.
*/

var express = require('express');
var router = express.Router();
let userController = require('../controllers/user')

let passport = require('passport');


/* GET users listing. */
router.get('/',passport.authenticate('jwt', {session: false}), userController.retrieve);

// Sign-up
router.post('/', userController.signup);

// Sign-in
router.post('/signin', userController.signin);

// Routers for edit
router.put('/', passport.authenticate('jwt', {session: false}), userController.processEdit);

module.exports = router;
