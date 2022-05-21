/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: Handles survey to database.
*/

let mongoose = require('mongoose');

// Create a model class
let surveyModel = mongoose.Schema(
    {
        title: String,
        template: String,
        questions: [
            {
                questionId: Number,
                questionText: String,
                questionOptionText: String
            }
        ],
        startDate: Date,
        endDate: Date,
        userId: String,
        publish: Boolean
    },
    {
        collection: "survey"
    },
    {
        //createdAt, updatedAt
        timestamps: true 
    }
);

module.exports = mongoose.model('survey', surveyModel);