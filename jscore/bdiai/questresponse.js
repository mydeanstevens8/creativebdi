"use strict"

const XAIQuestionFramework = {
    description: "Question",
    answers: [{text: "Response", value: 0}],
    response: function(bdim, choice) {

    }
};

const XAIRatingSystem = [
    {text: "0", value: 0}, {text: "1", value: 0.1}, {text: "2", value: 0.2}, {text: "3", value: 0.3}, {text: "4", value: 0.4}, {text: "5", value: 0.5},
    {text: "6", value: 0.6}, {text: "7", value: 0.7}, {text: "8", value: 0.8}, {text: "9", value: 0.9}, {text: "10", value: 1}
];

const XAICreativeRate = {
    __proto__: XAIQuestionFramework,
    description: "Rate my creativity score:",
    answers: XAIRatingSystem,
    response: function(bdim, choice) {
        bdim.xai.userRatings.creativity = choice;
    }
};

const XAICreativeMeta = {
    __proto__: XAIQuestionFramework,
    description: "Do you want me to be more creative?",
    answers: [{text: "Yes please", value: true}, {text: "It's already creative", value: false}],
    response: function(bdim, choice) {
        if(choice) {
            bdim.xai.askXAIQuestion(bdim, XAICreativeRate);
        }
    }
};

const XAINoveltyRate = {
    __proto__: XAIQuestionFramework,
    description: "Give me a novelty target (10 being more novel):",
    answers: XAIRatingSystem,
    response: function(bdim, choice) {
        bdim.xai.userRatings.novelty = choice;
        bdim.desires.creativity.novelty = choice;
    }
};

const XAINoveltyMeta = {
    __proto__: XAIQuestionFramework,
    description: "Can you improve my novelty (i.e. my randomness)?",
    answers: [{text: "Yes please", value: true}, {text: "It's already novel", value: false}],
    response: function(bdim, choice) {
        if(choice) {
            bdim.xai.askXAIQuestion(bdim, XAINoveltyRate);
        }
    }
};

const XAIConcretenessRate = {
    __proto__: XAIQuestionFramework,
    description: "Help me improve my originality by giving me a target (10 being more original):",
    answers: XAIRatingSystem,
    response: function(bdim, choice) {
        bdim.desires.creativity.concreteness = 1 - choice;
    }
};

const XAIConcretenessMeta = {
    __proto__: XAIQuestionFramework,
    description: "Would you like to improve my originality (i.e. how often I base myself on something very new)?",
    answers: [{text: "Yes please", value: true}, {text: "It's already original", value: false}],
    response: function(bdim, choice) {
        if(choice) {
            bdim.xai.askXAIQuestion(bdim, XAIConcretenessRate);
        }
    }
};

const XAIFillColorsReasons = {
    __proto__: XAIQuestionFramework,
    description: "Why not?",
    answers: [{text: "Too bland...", value: 0.2}, {text: "Just not right...", value: 0}, {text: "Too jarrring...", value: -0.2}],
    response: function(bdim, choice) {
        bdim.beliefs.fill.novelty += choice;
    }
};

const XAIFillColors = {
    __proto__: XAIQuestionFramework,
    description: "Do you like those colors?",
    answers: [{text: "Yes!", value: true}, {text: "No...", value: false}],
    response: function(bdim, choice) {
        if(!choice) {
            bdim.xai.askXAIQuestion(bdim, XAIFillColorsReasons);
        }
    }
};

const XAILikeMeta = {
    __proto__: XAIQuestionFramework,
    description: "Do you like this image?",
    answers: [{text: "Yes!", value: true}, {text: "No...", value: false}],
    response: function(bdim, choice) {
        bdim.beliefs.image.ratings.push({image: lastImage, liked: choice});
    }
};

const XAIEmotionMeta = {
    __proto__: XAIQuestionFramework,
    description: "What kind of emotions does this image express?",
    answers: [
        // Variant of the basic wheels of emotions + self-conscious emotions tested
        {text: "Joy", value: "joy"}, 
        {text: "Boldness", value: "boldness"}, 
        {text: "Anger", value: "anger"}, 
        {text: "Sadness", value: "sadness"}, 
        {text: "Curiosity", value: "curiosity"}, 
        {text: "Surprise", value: "surprise"}, 
        {text: "Disgust", value: "disgust"}, 
        {text: "Fear", value: "fear"}, 
        {text: "Trust", value: "trust"}, 
        {text: "Anticipation", value: "anticipation"},
        
        {text: "Shame", value: "shame"},
        {text: "Embarassment", value: "embarassment"},
        {text: "Guilt", value: "guilt"},
        {text: "Pride", value: "pride"}
    ],
    response: function(bdim, choice) {
        bdim.beliefs.image.emotions.push({image: lastImage, emo: choice});
    }
};

const XAIModelSelect = {
    __proto__: XAIQuestionFramework,
    description: "What kind of model should I select?",
    answers: [
        // Variant of the basic wheels of emotions + self-conscious emotions tested
        {text: "Data & cluster expectation and variance model", value: 0}, 
        {text: "Generative-shape based model", value: 1}, 
    ],
    response: function(bdim, choice) {
        bdim.desires.model = choice;
    }
};

function XAIParamAdjust(name, value, callback, mul=1) {
    return {
        __proto__: XAIQuestionFramework,
        description: "<span>Adjust my "+name+":</span><input type='range' min='0' max='1' step='0.01' value='"+value+"' id='xaislider' name='xaislider' />",
        answers: [
            // Variant of the basic wheels of emotions + self-conscious emotions tested
            {text: "OK", value: true}, 
            {text: "Cancel", value: false}, 
        ],
        response: function(bdim, choice) {
            if(choice) {
                var xval = mul * $("#xaislider").val();
                if(painter) painter.showBannerBox("My "+ name + " has been adjusted to "+xval, "info");
                callback(xval);
            }
        }
    }
}

const XAIMetaSelect = {
    __proto__: XAIQuestionFramework,
    description: "Give me a topic...",
    answers: [
        // Variant of the basic wheels of emotions + self-conscious emotions tested
        {text: "Fill Novelty", value: "fill novel"}, 
        {text: "Fill Originality", value: "fill orig"}, 
        {text: "Fill Concreteness", value: "fill conc"}, 
        {text: "Fill Target", value: "fill target"}, 
        {text: "Fill Adherence", value: "fill adh"}, 
        {text: "Stroke Novelty", value: "stroke novel"}, 
        {text: "Stroke Originality", value: "stroke orig"}, 
        {text: "Stroke Concreteness", value: "stroke conc"}, 
        {text: "Stroke Target", value: "stroke target"}, 
        {text: "Stroke Adherence", value: "stroke adh"}, 
        {text: "Stroke Width Novelty", value: "sw novel"}, 
        {text: "Stroke Width Originality", value: "sw orig"}, 
        {text: "Stroke Width Concreteness", value: "sw conc"}, 
        {text: "Stroke Width Target", value: "sw target"}, 
        {text: "Stroke Width Adherence", value: "sw adh"}, 
        {text: "Position and Size Novelty", value: "pos novel"}, 
        {text: "Position and Size Originality", value: "pos orig"}, 
        {text: "Position and Size Concreteness", value: "pos conc"}, 
        {text: "Meta Novelty", value: "meta novel"}, 
        {text: "Meta Originality", value: "meta orig"}, 
        {text: "Meta Concreteness", value: "meta conc"},  
        {text: "Meta Clustering", value: "meta clus"},
        {text: "Model Choice", value: "modelchoice"},  
    ],
    response: function(bdim, choice) {
        var q = null;
        
        if(choice.includes("fill")) {
            if(choice.includes("novel")) {
                q = XAIParamAdjust("fill novelty", bdim.beliefs.fill.novelty, (r) => bdim.beliefs.fill.novelty = r);
            }
            if(choice.includes("orig")) {
                q = XAIParamAdjust("fill originality", bdim.beliefs.fill.originality, (r) => bdim.beliefs.fill.originality = r);
            }
            if(choice.includes("conc")) {
                q = XAIParamAdjust("fill concreteness", bdim.beliefs.fill.concreteness, (r) => bdim.beliefs.fill.concreteness = r);
            }
            
            if(choice.includes("adh")) {
                q = XAIParamAdjust("fill target adherence", bdim.desires.constantDesires.fill.adherence , (r) => bdim.desires.constantDesires.fill.adherence = r);
            }
            
            if(choice.includes("target")) {
                console.log(bdim.desires.constantDesires)
                // Color chooser here
                painter.launchCustomColorChooserEx((r) => bdim.desires.constantDesires.fill.target = r, (r,g,b,a) => [r, g, b, a]);
                return;
            }
        }
        
        if(choice.includes("stroke")) {
            if(choice.includes("novel")) {
                q = XAIParamAdjust("stroke novelty", bdim.beliefs.stroke.novelty, (r) => bdim.beliefs.stroke.novelty = r);
            }
            if(choice.includes("orig")) {
                q = XAIParamAdjust("stroke originality", bdim.beliefs.stroke.originality, (r) => bdim.beliefs.stroke.originality = r);
            }
            if(choice.includes("conc")) {
                q = XAIParamAdjust("stroke concreteness", bdim.beliefs.stroke.concreteness , (r) => bdim.beliefs.stroke.concreteness = r);
            }
            
            if(choice.includes("adh")) {
                q = XAIParamAdjust("stroke target adherence", bdim.desires.constantDesires.stroke.adherence , (r) => bdim.desires.constantDesires.stroke.adherence = r);
            }
            
            if(choice.includes("target")) {
                // Color chooser here
                painter.launchCustomColorChooserEx((r) => bdim.desires.constantDesires.stroke.target = r, (r,g,b,a) => [r, g, b, a]);
                return;
            }
        }
        
        
        if(choice.includes("sw")) {
            if(choice.includes("novel")) {
                q = XAIParamAdjust("stroke width novelty", bdim.beliefs.strokeWidth.novelty, (r) => bdim.beliefs.strokeWidth.novelty = r);
            }
            if(choice.includes("orig")) {
                q = XAIParamAdjust("stroke width originality", bdim.beliefs.strokeWidth.originality, (r) => bdim.beliefs.strokeWidth.originality = r);
            }
            if(choice.includes("conc")) {
                q = XAIParamAdjust("stroke width concreteness", bdim.beliefs.strokeWidth.concreteness , (r) => bdim.beliefs.strokeWidth.concreteness = r);
            }
            
            if(choice.includes("adh")) {
                q = XAIParamAdjust("stroke width adherence", bdim.desires.constantDesires.strokeWidth.adherence , (r) => bdim.desires.constantDesires.strokeWidth.adherence = r);
            }
            
            
            if(choice.includes("target")) {
                q = XAIParamAdjust("stroke width target", bdim.desires.constantDesires.strokeWidth.target , (r) => bdim.desires.constantDesires.strokeWidth.target = r, 100);
            }
        }
        
        if(choice.includes("pos")) {
            if(choice.includes("novel")) {
                q = XAIParamAdjust("position and size novelty", bdim.beliefs.posSize.novelty, (r) => bdim.beliefs.posSize.novelty = r);
            }
            if(choice.includes("orig")) {
                q = XAIParamAdjust("position and size originality", bdim.beliefs.posSize.originality, (r) => bdim.beliefs.posSize.originality = r);
            }
            if(choice.includes("conc")) {
                q = XAIParamAdjust("position and size concreteness", bdim.beliefs.posSize.concreteness, (r) => bdim.beliefs.posSize.concreteness = r);
            }
        }
        
        if(choice.includes("meta")) {
            if(choice.includes("novel")) {
                q = XAIParamAdjust("novelty desire", bdim.desires.creativity.novelty, (r) => bdim.desires.creativity.novelty = r);
            }
            if(choice.includes("orig")) {
                q = XAIParamAdjust("originality desire", bdim.desires.creativity.originality, (r) => bdim.desires.creativity.originality = r);
            }
            if(choice.includes("conc")) {
                q = XAIParamAdjust("concreteness desire", bdim.desires.creativity.concreteness, (r) => bdim.desires.creativity.concreteness = r);
            }
            
            if(choice.includes("clus")) {
                q = XAIParamAdjust("clustering desire", bdim.desires.creativity.clustering, (r) => bdim.desires.creativity.clustering = r);
            }
        }
        
        if(choice.includes("modelchoice")) {
            q = XAIModelSelect;
        }
        
        console.log(q)
        
        if(q !== null)
            bdim.xai.askXAIQuestion(bdim, q);
    }
};

const XAIQuestionList = [];

