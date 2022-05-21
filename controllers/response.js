/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: Store and release the response info and handle errors when occur.
*/

const { default: mongoose } = require('mongoose');
let Response = require('../models/response');
const survey = require('../models/survey');
let Survey = require('../models/survey');

//Error handling
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

//List Respond
exports.list = function(req, res, next) { 
    let id = req.params.surveyId;
    let userid = req.user._id;

    Survey.findOne({_id: id}, {userId: 1},  (err, survey) => {
        if(err)
        {
            console.log(err);
            return res.status(400).json(
                { 
                  success: false, 
                  message: getErrorMessage(err)
                }
            );
        }
        else
        {
            console.log(survey);
            if (survey.userId != userid)
            {
                console.log("bingo");
                console.log("Unauthorized");
                return res.status(400).json(
                    { 
                    success: false, 
                    message: "Unauthorized"
                    }
                );
            }
        }
    });

    Response.find({surveyId:id},(err,response)=>{
        if(err)
        {
            return res.status(400).json(
                { 
                  success: false, 
                  message: getErrorMessage(err)
                }
            );
        }
        else
        {
            res.status(200).json(response);
        }
    })
}

//Create Respond
module.exports.add = (req, res, next) => {
    let questionId = req.body.questionId;
    let responses = [];
    for (let i = 0; i < questionId?.length; i++) {
        console.log(req.body["questionOption_"+questionId[i]]);
        responses[i] = {
            questionId: questionId[i],
            questionText: req.body.questionText[i],
            answer: req.body["questionOption_"+questionId[i]]
        };
    }
    const timestamp = new Date();
    let timestamptxt = timestamp.toUTCString();
    let newResponse = Response({
        surveyId: req.body.surveyId,
        username: req.user ? req.user.username : req.body.username ? req.body.username : "Anonymous",
        responses: req.body.responses.length == 0 ? responses : req.body.responses,
        responseDate: timestamptxt  
    });

    Response.create(newResponse, (err,response) => {
        if(err)
        {
            console.log(err);
            return res.status(400).json(
                { 
                  success: false, 
                  message: getErrorMessage(err)
                }
            );
        }
        else
        {
            console.log(response);
            return res.status(200).json(
                { 
                  success: true
                }
            );
        }
    });
}

//Return Stiatics of a Respond
module.exports.statistics = function(req, res, next) { 
    let id = req.params.surveyId;
    let userid = req.user._id;

    Survey.findOne({_id: id}, {_id: 0, userId: 1},  (err, survey) => {
        if(err)
        {
            console.log(err);
            return res.status(400).json(
                { 
                  success: false, 
                  message: getErrorMessage(err)
                }
            );
        }
        else
        {
            if (survey.userId != userid)
            {
                console.log("Unauthorized");
                return res.status(400).json(
                    { 
                    success: false, 
                    message: "Unauthorized"
                    }
                );
            }
        }
    });

    Response.aggregate(
        [
            {$match: {surveyId: id}},
            {$facet: 
                {
                    surveyStatistics: [
                        {
                            $group: {
                                _id: null,
                                // surveyId: "$surveyId",
                                numOfSurveyResponds: { $sum: 1}
                            }
                        }
                    ],
                    respondStatistics: [
                        {$unwind: "$responses"},
                        {$group: 
                            {
                                _id: {
                                    // surveyId: "$surveyId",
                                    questionId: "$responses.questionId",
                                    questionText: "$responses.questionText",
                                    answer: "$responses.answer",
                                },      
                                numOfResponds: { $sum:1}
                            }
                        }
                    ]
                }
            },
        ], function(err, result) {
            if(err)
            {
                console.log(err);
                return res.status(400).json(
                    { 
                        success: false, 
                        message: getErrorMessage(err)
                    }
                );
            }
            else{
                res.status(200).json(result);
            }
        }
    );
}
