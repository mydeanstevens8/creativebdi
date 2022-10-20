"use strict"

// Questions that can be asked at random by XAI.
const XAIQuestions = [
    XAIMetaSelect,
]

const questions = {
    // Records for user input data (4 elements)
    userRatings: {
        creativity: 0,
        novelty: 0,
        originality: 0,
        quality: 0,
    },

    // Feedback framework.

    // All questions
    questions: XAIQuestions,

    // Ask XAI question
    askXAIQuestion(bdim, qu) {
        // console.log(qu)

        var genHTML = "<div class='XAIdesc'>" + qu.description + "</div>"

        // Try to prevent ID clashing.
        var randomSetting = EMath.applyDiscreteVariance(10000000);

        var ulAnsHTML = "<div class='XAIansers'>";

        for(var i = 0; i < qu.answers.length; i++) {
            var ansHTML = "<button class='XAIans' id='XAIans"+randomSetting+""+i+"'>" + qu.answers[i].text + "</button>";
            // console.log(ansHTML);
            ulAnsHTML += ansHTML;
        }

        ulAnsHTML += "</div>";

        var banner = painter.showBannerBox(genHTML + ulAnsHTML, "XAI", true);

        var customResponse = function(localI) {
            return function(event){
                // Initiate response
                qu.response(bdim, qu.answers[localI].value);

                // Close the banner - after response.
                painter.deleteBannerBox(banner);
            };
        }

        // Close this when any button is clicked.
        for(var i = 0; i < qu.answers.length; i++) {
            $("#XAIans"+randomSetting+""+i).click(customResponse(i));
        }
    },

    askRandomXAIQuestion(bdim) {
        var ranSel = Math.floor(EMath.randRange(0, this.questions.length));

        this.askXAIQuestion(bdim, this.questions[ranSel]);
    },
}

function XQuests() {}
Object.assign(XQuests.prototype, questions);