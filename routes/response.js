/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: Handles the necessary routes that functions with response.
*/

let express = require('express');
let router = express.Router();
let responseController = require('../controllers/response');
let passport = require('passport');

// response can be viewed by created
/* GET Route for displaying response list according to surveyId*/
router.get('/:surveyId', passport.authenticate('jwt', {session: false}), responseController.list);

// response can be made by anonymous
/* POST Route for processing the Add page - CREATE Operation */
router.post('/:surveyId', responseController.add);

// response can be viewed by created
/* GET Route for statistics of response according to surveyId*/
router.get('/statistics/:surveyId', passport.authenticate('jwt', {session: false}), responseController.statistics);

module.exports = router;