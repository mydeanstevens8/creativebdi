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
        {text: "Innovative line generator", value: 2}, 
    ],
    response: function(bdim, choice) {
        bdim.desires.model = choice;
    }
};

function XAIParamAdjust(name, value, callback, mul=1) {
    return {
        __proto__: XAIQuestionFramework,
        description: "<span>Adjust my "+name+":</span><input type='range' min='0' max='1' step='any' value='"+(value/mul)+"' id='xaislider' name='xaislider' />",
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


const XAIShapedSelect = {
    __proto__: XAIQuestionFramework,
    description: "Give me a topic (in random shape generation)...",
    answers: [
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
        
        if(q !== null)
            bdim.xai.askXAIQuestion(bdim, q);
    }
};


const XAIMetaSelect = {
    __proto__: XAIQuestionFramework,
    description: "Give me a topic...",
    answers: [
        {text: "&gt; Shape generator settings", value: "shape_sub"}, 
        {text: "&gt; Line generator settings", value: "line_sub"},  
        {text: "&gt; Model Choice", value: "modelchoice"},  
    ],
    response: function(bdim, choice) {
        var q = null;
        
        if(choice.includes("shape_sub")) {
            q = XAIShapedSelect;
        }
        
        if(choice.includes("line_sub")) {
            q = XAILinesSelect;
        }
        
        if(choice.includes("modelchoice")) {
            q = XAIModelSelect;
        }
        
        console.log(q)
        
        if(q !== null)
            bdim.xai.askXAIQuestion(bdim, q);
    }
};

function XAIBool(msg, callback, yval="Yes", nval="No") {
    return {
        __proto__: XAIQuestionFramework,
        description: msg,
        answers: [
            {text: yval, value: true},
            {text: nval, value: false},
        ],
        response: function(bdim, choice) {
            callback(choice);
        }
    };
}

const XAILinesSelect = {
    __proto__: XAIQuestionFramework,
    description: "Give me a topic (in line drawing)...",
    answers: [
        // Variant of the basic wheels of emotions + self-conscious emotions tested
        {text: "Length target", value: "length targ"}, 
        {text: "Length variation", value: "length var"}, 
        {text: "Step target", value: "step targ"}, 
        {text: "Step variation", value: "step var"}, 
        {text: "Deviance target", value: "dev targ"}, 
        {text: "Deviance variation", value: "dev var"},  
        {text: "Start X", value: "start x"}, 
        {text: "Start Y", value: "start y"}, 
        
        {text: "Branching probability", value: "branch prob"},  
        
        {text: "Color start from belief", value: "color belief"}, 
        {text: "Color desire", value: "color desire"}, 
        
        {text: "Color random walk target", value: "color randw targ"}, 
        {text: "Color random walk variance", value: "color randw var"}, 
        {text: "Color random variance", value: "color randv"}, 
        {text: "Color randomness choice", value: "color rwvuse"}, 
        
        {text: "Stroke color start from belief", value: "stroke belief"}, 
        {text: "Stroke color desire", value: "stroke desire"}, 
        {text: "Stroke width start from belief", value: "sw belief"}, 
        {text: "Stroke width desire", value: "sw desire"}, 
        
        {text: "Shape type start from belief", value: "st belief"}, 
    ],
    response: function(bdim, choice) {
        var q = null;
        
        if(choice.includes("length")) {
            if(choice.includes("targ")) {
                q = XAIParamAdjust("length target", bdim.desires.lines.pos.length.target, (r) => bdim.desires.lines.pos.length.target = r, 1000);
            }
            if(choice.includes("var")) {
                q = XAIParamAdjust("length variation", bdim.desires.lines.pos.length.var, (r) => bdim.desires.lines.pos.length.var = r, 200);
            }
        }
        
        if(choice.includes("step")) {
            if(choice.includes("targ")) {
                q = XAIParamAdjust("step target", bdim.desires.lines.pos.step.target, (r) => bdim.desires.lines.pos.step.target = r, 100);
            }
            if(choice.includes("var")) {
                q = XAIParamAdjust("step variation", bdim.desires.lines.pos.step.var, (r) => bdim.desires.lines.pos.step.var = r, 20);
            }
        }
        
        if(choice.includes("dev")) {
            if(choice.includes("targ")) {
                q = XAIParamAdjust("deviance target", bdim.desires.lines.pos.deviance.target, (r) => bdim.desires.lines.pos.deviance.target = r, 90);
            }
            if(choice.includes("var")) {
                q = XAIParamAdjust("deviance variation", bdim.desires.lines.pos.deviance.var, (r) => bdim.desires.lines.pos.deviance.var = r, 30);
            }
        }
        
        if(choice.includes("start")) {
            if(choice.includes("x")) {
                q = XAIParamAdjust("deviance target", bdim.desires.lines.pos.start.x, (r) => bdim.desires.lines.pos.start.x = r, 1000);
            }
            if(choice.includes("y")) {
                q = XAIParamAdjust("deviance variation", bdim.desires.lines.pos.start.y, (r) => bdim.desires.lines.pos.start.y = r, 1000);
            }
        }
        
        
        if(choice.includes("color")) {
            if(choice.includes("belief")) {
                q = XAIBool("Turn on fill color belief from shape?", (r) => bdim.desires.lines.color.startFromBelief = r);
            }
            if(choice.includes("desire")) {
                // Color chooser here
                painter.launchCustomColorChooserEx((r) => bdim.desires.lines.color.startDesire = r, (r,g,b,a) => [r, g, b, a]);
                return;
            }
            
            if(choice.includes("randw")) {
                if(choice.includes("targ")) {
                    q = XAIParamAdjust("color random walk target", bdim.desires.lines.color.randomWalk.target, (r) => bdim.desires.lines.color.randomWalk.target = r, 100);
                }
                if(choice.includes("var")) {
                    q = XAIParamAdjust("color random walk variance", bdim.desires.lines.color.randomWalk.var, (r) => bdim.desires.lines.color.randomWalk.var = r, 30);
                }
            }
            
            if(choice.includes("randv")) {
                q = XAIParamAdjust("color random variance target", bdim.desires.lines.color.randomVar.target, (r) => bdim.desires.lines.color.randomVar.target = r, 100);
            }
            
            if(choice.includes("rwvuse")) {
                q = XAIBool("Use color walking or simple variance?", (r) => bdim.desires.lines.color.walkMode = r, "Color walking", "Simple variance");
            }
        }
        
        
        if(choice.includes("stroke")) {
            if(choice.includes("belief")) {
                q = XAIBool("Turn on stroke color belief from shape?", (r) => bdim.desires.lines.strokeColor.startFromBelief = r);
            }
            if(choice.includes("desire")) {
                // Color chooser here
                painter.launchCustomColorChooserEx((r) => bdim.desires.lines.strokeColor.startDesire = r, (r,g,b,a) => [r, g, b, a]);
                return;
            }
        }
        
        
        if(choice.includes("sw")) {
            if(choice.includes("belief")) {
                q = XAIBool("Turn on stroke width belief from shape?", (r) => bdim.desires.lines.strokeWidth.startFromBelief = r);
            }
            if(choice.includes("desire")) {
                // Color chooser here
                q = XAIParamAdjust("stroke width desire", bdim.desires.lines.strokeWidth.startDesire, 
                                   (r) => bdim.desires.lines.strokeWidth.startDesire = r, 100);
            }
        }
        
        
        if(choice.includes("st")) {
            if(choice.includes("belief")) {
                q = XAIBool("Turn on shape type belief?", (r) => bdim.desires.lines.shapeType.startFromBelief = r);
            }
        }
        
        if(choice.includes("branch")) {
            if(choice.includes("prob")) {
                q = XAIParamAdjust("branching probability", bdim.desires.lines.pos.branching.probability, (r) => bdim.desires.lines.pos.branching.probability = r, 1);
            }
        }
        
        console.log(q)
        
        if(q !== null)
            bdim.xai.askXAIQuestion(bdim, q);
    }
};

const XAIQuestionList = [];

