function IntentionClusterModel(myself) {
    // Here's the big part!

    // Blending in between clusters and data controlled by concreteness belief.

    // Our generative model is quite complex, but here it goes.

    // First, we pick a model, or a cluster, or we generate entirely randomly.

    // Now our parameters control for this.
    var globalConcreteness = myself.desires.creativity.concreteness;
    var globalVariance = myself.desires.creativity.novelty;
    var globalBlending = myself.desires.creativity.originality;

    // Discrete int.
    var globalClusters = myself.desires.number.clusters;
    var globalClusterVar = myself.desires.number.clusterVariance;
    var calcClusters = globalClusters + EMath.applyDiscreteVariance(globalClusterVar);

    var globalShapesTarget = myself.desires.number.target;
    var globalShapesVar = EMath.applyDiscreteVariance(globalShapesTarget);

    var globalShapesChoice = myself.desires.number.min + globalShapesVar;

    // Model programming time. The basis is selected from concreteness and variance (novelty)
    var basisSelect = EMath.clamp((1 - globalConcreteness) + ((2*EMath.random() - 1) * globalVariance), 0, 1);

    // Advanced model step. Which one to select?
    var advancedModel = myself.intentions.whole.generateMultiple(myself, globalClusters + EMath.applyDiscreteVariance(globalClusterVar));

    var dataBeliefModel = myself.intentions.shape.generateSetFromDataBelief(myself, globalClusters + EMath.applyDiscreteVariance(globalClusterVar));

    // Toy with data.
    var model;


    // Switch based on the basis select what model we should have
    if(basisSelect < 0.2) {
        model = myself.intentions.whole.generateSingle(myself);
    }
    else if(basisSelect < 0.4) {
        model = myself.intentions.whole.generateMultiple(myself, calcClusters);
    }
    else if(basisSelect < 0.6) {
        model = myself.intentions.shape.generateSetFromDataBelief(myself, globalShapesChoice * calcClusters);
    }
    else if(basisSelect < 0.8) {
        model = myself.intentions.shape.generateSetFromClusterBelief(myself, globalShapesChoice * calcClusters);
    }
    else {
        model = myself.intentions.shape.generateSetFromNovelBelief(myself, globalShapesChoice * calcClusters);
    }

    console.log("Basis: "+ basisSelect + ", Model: " + model);

    // Then we toy with the model.
    var modProbability = function(c, v) {
        return EMath.clamp(c + ((2*EMath.random() - 1) * v), 0, 1);
    }

    // We have a chance of modifying each property, for each shape.
    // FILL
    model.objects.map(function(shape) {
        // Modifying fill chance.
        var mp = modProbability(
            (1 - myself.beliefs.fill.concreteness) / 2, 
            (myself.beliefs.fill.novelty) / 2
        );
        return myself.intentions.mods.doRandomFillParamSelection(myself, shape, mp);
    });

    // STROKE
    model.objects.map(function(shape) {
        // Modifying fill chance.
        var mp = modProbability(
            (1 - myself.beliefs.stroke.concreteness) / 2, 
            (myself.beliefs.stroke.novelty) / 2
        );
        return myself.intentions.mods.doRandomStrokeParamSelection(myself, shape, mp);
    });


    // STROKE WIDTH
    model.objects.map(function(shape) {
        // Modifying fill chance.
        var mp = modProbability(
            (1 - myself.beliefs.strokeWidth.concreteness) / 2, 
            (myself.beliefs.strokeWidth.novelty) / 2
        );
        return myself.intentions.mods.doRandomSWParamSelection(myself, shape, mp);
    });

    // Random positioning
    model.objects.map(function(shape) {
        // Modifying fill chance.
        var mp = modProbability(
            (1 - myself.beliefs.strokeWidth.concreteness) / 2, 
            (myself.beliefs.strokeWidth.novelty) / 2
        );
        return myself.intentions.mods.doRandomMovement(myself, shape, mp);
    });

    return model;
}