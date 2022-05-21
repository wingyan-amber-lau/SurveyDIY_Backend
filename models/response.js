/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: Handles response to database.
*/

let mongoose = require('mongoose');

// Create a model class
let responseModel = mongoose.Schema(
    {
        surveyId: String,
        username: String,
        responses: [
            {
                questionId: Number,
                questionText: String,
                answer: String
            }
        ],
        responseDate: Date
    },
    {
        collection: "response"
    }
);

module.exports = mongoose.model('response', responseModel);