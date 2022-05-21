/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: Handles the necessary routes that functions with survey.
*/

let express = require('express');
let router = express.Router();
let surveyController = require('../controllers/survey');
let passport = require('passport');

router.get('/',passport.authenticate('jwt', {session: false}), surveyController.list);
router.get('/open', surveyController.open);
router.get('/:id', surveyController.retrieve);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/', passport.authenticate('jwt', {session: false}), surveyController.add);

// Routers for edit
// router.get('/edit/:id', requireAuth, surveyController.displayEditPage);
router.put('/:id', passport.authenticate('jwt', {session: false}), surveyController.edit);

// Delete
router.delete('/:id', passport.authenticate('jwt', {session: false}), surveyController.delete);

module.exports = router;