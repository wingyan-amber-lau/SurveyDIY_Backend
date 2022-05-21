/*
  Survey DIY
Sze Man Tang – 301221595
Wing Yan Lau – 301229696
Hussein Hussein– 301017560
Kanishka Dhir– 301220757
Angel Fortino Cruz Benitez – 301238011
Vikas Bhargav Trivedi – 301217554

Description: Store and release the survey info and handle errors when occur.
*/

let Survey = require('../models/survey');
let Response = require('../models/response');

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

exports.open = function(req, res, next) {
    Survey.find({publish: true, startDate:{"$lte": Date.now()},endDate:{"$gte": Date.now()}}, (err, surveyList) => {
        if(err)
        {
            console.error(err);
            return res.status(400).json(
                 { 
                  success: false, 
                  message: getErrorMessage(err)
                }
            );
        }
        else
        {
            let resSurveyList = [];
            surveyList.forEach((survey,index,array)=>{
                let questionId = [];
                let questionText = [];
                let questionOptionText = [];
                survey.questions.forEach((element)=>{
                    questionId.push(element.questionId);
                    questionText.push(element.questionText);
                    questionOptionText.push(element.questionOptionText);
                });
                let resSurvey = {
                    '_id':survey._id,
                    'title':survey.title,
                    'template': survey.template,
                    'questionId': questionId,
                    'questionText': questionText,
                    'questionOptionText': questionOptionText,
                    'startDate': survey.startDate,
                    'endDate':survey.endDate,
                    'publish':survey.publish
                }
                resSurveyList.push(resSurvey);
            });
           res.status(200).json(resSurveyList);
        }
    });
}

exports.list = function(req, res, next) {
     
    let userid=req.user._id; //displaying only surveys which that user has created
    
    Survey.find({userId: userid}, (err, surveyList) => {
        if(err)
        {
            console.log(err.message)
            return res.status(400).json(
                { 
                  success: false, 
                  message: getErrorMessage(err)
                }
            );
        }
        else
        {
            let resSurveyList = [];
            surveyList.forEach((survey,index,array)=>{
                let questionId = [];
                let questionText = [];
                let questionOptionText = [];
                survey.questions.forEach((element)=>{
                    questionId.push(element.questionId);
                    questionText.push(element.questionText);
                    questionOptionText.push(element.questionOptionText);
                });
                let resSurvey = {
                    '_id':survey._id,
                    'title':survey.title,
                    'template': survey.template,
                    'questionId': questionId,
                    'questionText': questionText,
                    'questionOptionText': questionOptionText,
                    'startDate': survey.startDate,
                    'endDate':survey.endDate,
                    'publish':survey.publish
                }
                resSurveyList.push(resSurvey);
            });
            
           res.status(200).json(resSurveyList);
        }
    });
}

module.exports.retrieve = (req, res, next) => {
    let id = req.params.id;
    Survey.findById(id, (err, survey) => {
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
            let questionId = [];
            let questionText = [];
            let questionOptionText = [];
            survey.questions.forEach((element,index,array)=>{
                questionId.push(element.questionId);
                questionText.push(element.questionText);
                questionOptionText.push(element.questionOptionText);
            });
            let resSurvey = {
                '_id':survey._id,
                'title':survey.title,
                'template': survey.template,
                'questionId': questionId,
                'questionText': questionText,
                'questionOptionText': questionOptionText,
                'startDate': survey.startDate,
                'endDate':survey.endDate,
                'publish':survey.publish
            }
            res.status(200).json(resSurvey);
        }
    });          
}

module.exports.add = (req, res, next) => {
    console.log(req.body);
    let questionText = req.body.questionText;
    let questionOptionText = req.body.questionOptionText;
    let questions = [];
    let j = 1;
    for (let i = 0; i < questionText.length; i++) {
        let questionOption = "";
        if (questionText[i] != ""){
            //Handle question option based on template type
            if (req.body.template == "TF")
                questionOption = "True;False";
            else
                questionOption = questionOptionText[i];

            questions.push(
                {
                    questionId: j++,
                    questionText: questionText[i],
                    questionOptionText: questionOption
                }
            );
        }
    }

    

    let newSurvey = Survey({
        _id: req.body.id,
        title: req.body.title,
        template: req.body.template,
        questions : questions,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        userId: req.user ? req.user._id : '',
        publish: req.body.publish
    });

    Survey.create(newSurvey, (err, survey) =>{
        if(err)
        {
            console.log(err);
            return res.status(400).send(
                {
                    success: false,
                    message: getErrorMessage(err)
                }
            );
        }
        else
        {
            console.log(survey);
            return res.status(200).json(survey);
        }
    });
}

module.exports.edit = (req, res, next) => {
    let id = req.params.id
    let questionText = req.body.questionText;
    let questionOptionText = req.body.questionOptionText;
    let questions = [];
    let j = 1;
    for (let i = 0; i < questionText.length; i++) {
        if (questionText[i] != ""){
            let questionOption = "";
            if (req.body.template == "TF")
                questionOption = "True;False";
            else
                questionOption = questionOptionText[i];

            questions.push(
                {
                    questionId: j++,
                    questionText: questionText[i],
                    questionOptionText: questionOption
                }
            );
        }
    }

    let updatedItem = Survey(
        {
            _id: req.body.id,
            title: req.body.title,
            template: req.body.template,
            questions : questions,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            userId: req.user ? req.user._id : '',
            publish: req.body.publish
        }
    );

    Survey.findByIdAndUpdate(id,{
        title: req.body.title,
        template: req.body.template,
        questions : questions,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        userId: req.user ? req.user._id : '',
        publish: req.body.publish},{ new: true }, (err,data) => {
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
                return res.status(200).json(
                    { 
                    success: true, 
                    message: 'Item updated successfully.'
                    }
                );
            }
        }
    );
}



module.exports.delete = (req, res, next) => {
    let id = req.params.id;
    let list;
    Response.find({surveyId:id},(err,responseList)=>{
        if(err)
        {
            console.error(err);
            return res.status(400).json(
                { 
                  success: false, 
                  message: getErrorMessage(err)
                }
            );
        }
        else
        {
            console.log(responseList);
             list=responseList;
            for (x in responseList)
            {
                Response.remove({_id:responseList[x]._id},(err)=>{} )
            }
        }
    })

    Survey.remove({_id: id}, (err) => { 
        if(err)
        {
            console.log(err);
            // res.end(err);
            return res.status(400).send(
                {
                    success: false,
                    message: getErrorMessage(err)
                }
            );
        }
        else
        {
           return res.status(200).json(
                {
                    success: true,
                    message: "Survey removed successfully."
                }
            );
        }
    }); 
}
