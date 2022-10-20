function IntentionShapeSynthesisModel(myself) {
    function startingShapeBelief(basis=null, context=null) {
        var newShape = new NeuralObject();

        if(basis === null) {
            newShape.x = EMath.randRange(0, painter.getSize()[0]);
            newShape.y = EMath.randRange(0, painter.getSize()[1]);
            newShape.width = EMath.randRange(myself.beliefs.clips.hardSizeMin, myself.beliefs.clips.hardSizeMax);
            newShape.height = EMath.randRange(myself.beliefs.clips.hardSizeMin, myself.beliefs.clips.hardSizeMax);

            newShape.fill = EMath.generateRandomRGBA();
            newShape.stroke = EMath.generateRandomRGBA();

            newShape.strokeWidth = EMath.randRange(myself.beliefs.clips.hardStrWMin, myself.beliefs.clips.hardStrWMax);

            newShape.type = NeuralObjectTypes.RECTANGLE;
        }
        else {
            console.log("Basis def: ",basis)
            newShape.x = basis.x;
            newShape.y = basis.y;
            newShape.width = basis.width;
            newShape.height = basis.height;

            newShape.fill = basis.fill;
            newShape.stroke = basis.stroke;

            newShape.strokeWidth = basis.strokeWidth;

            newShape.type = basis.type;
        }

        newShape.meta = {context: context, basis: basis};

        return newShape;
    }

    function continuingShapeBelief(lastShape, concrete=1, original=0) {
        // Prefer bases over original shapes, given concreteness.
        // Choose based on concreteness
        // More true when concreteness is lower.
        var randomChoice = EMath.random() > concrete;

        var contextExists = lastShape.meta.context != null;

        // If randomChoice is true, we go with something abstract and new.
        // Or if no context exists.
        if(randomChoice || !contextExists) {
            // More true when original is higher
            var randomOriginality = EMath.random() < original;

            var basis = lastShape? lastShape.meta.basis : null;

            if(randomOriginality) basis = null;

            // Base ourselves off the original shape's basis if we have the
            // originality metric to go for it!
            return startingShapeBelief(basis);
        }

        else {
            // Base our shape off the context given by the last shape, if it exists.
            // In the context, select a random object to base off.
            var ctx = lastShape.meta.context;

            var ranObj = EMath.rsample(ctx.objects);

            // Then, we use this as our basis.
            var newObj = startingShapeBelief(ranObj, ctx);

            return newObj;
        }
    }

    function adjustmentColorMorph(col1, col2, mf) {
        var newCol = [
            EMath.clamp(col1[0] * (1 - mf) + col2[0] * mf, 0, myself.beliefs.clips.hardColorRange), 
            EMath.clamp(col1[1] * (1 - mf) + col2[1] * mf, 0, myself.beliefs.clips.hardColorRange), 
            EMath.clamp(col1[2] * (1 - mf) + col2[2] * mf, 0, myself.beliefs.clips.hardColorRange), 
            EMath.clamp(col1[3] * (1 - mf) + col2[3] * mf, 0, 1), 
        ];

        return newCol;
    }

    function adjustmentColorAdjust(col1, mf) {
        var newCol = [
            EMath.clamp(col1[0] + myself.beliefs.clips.hardColorRange*(2*EMath.random() - 1)*mf, 0, myself.beliefs.clips.hardColorRange), 
            EMath.clamp(col1[1] + myself.beliefs.clips.hardColorRange*(2*EMath.random() - 1)*mf, 0, myself.beliefs.clips.hardColorRange), 
            EMath.clamp(col1[2] + myself.beliefs.clips.hardColorRange*(2*EMath.random() - 1)*mf, 0, myself.beliefs.clips.hardColorRange), 
            EMath.clamp(col1[3] + (2*EMath.random() - 1)*mf, 0, 1), // Alpha
        ];

        return newCol;
    }

    function adjustmentPSMorph(col1, col2, mf) {
        var newCol = [
            col1[0] * (1 - mf) + col2[0] * mf, 
            col1[1] * (1 - mf) + col2[1] * mf, 
            col1[2] * (1 - mf) + col2[2] * mf, 
            col1[3] * (1 - mf) + col2[3] * mf, 
        ];

        return newCol;
    }

    function adjustmentPSAdjust(col1, mf) {
        var newCol = [
            col1[0] + 500*(2*EMath.random() - 1)*mf, 
            col1[1] + 500*(2*EMath.random() - 1)*mf, 
            col1[2] + 500*(2*EMath.random() - 1)*mf, 
            col1[3] + 500*(2*EMath.random() - 1)*mf, 
        ];

        return newCol;
    }

    function adjustmentBeliefColor(shape, param, novelty = 1, originality = 1, target = [0, 0, 0, 0], adherence = 0) {
        // Modify the shape according to another.
        var ctx = shape.meta.context;

        var ourColor = Reflect.get(shape, param);

        var selectedShape = null;
        if(ctx !== null) {
            selectedShape = EMath.rsample(ctx.objects);
        }

        var beNovel = EMath.random() < novelty;

        // Then modified by a morphing factor.
        var morphPercent = EMath.random() * originality;

        var newColor = ourColor;

        if(beNovel) {
            // True if novelty is higher
            selectedShape = null;

            // Randomly adjust by a color.
            newColor = adjustmentColorAdjust(ourColor, morphPercent);
        }

        if(selectedShape !== null) {
            // Base of selected shape.
            var theirColor = Reflect.get(selectedShape, param);
            // Morph between the colors.
            newColor = adjustmentColorMorph(ourColor, theirColor, morphPercent);
        }

        console.log("Tar: ",target);
        console.log("Adh: ",adherence);

        // Adjustment for color cluster morphing.
        // (Specific creativity)
        var colMorph = helperAdd(helperMul(target, adherence), helperMul(newColor, 1-adherence));

        console.log(colMorph);

        Reflect.set(shape, param, colMorph);
        return shape;
    }

    function adjustmentBeliefPosition(shape, novelty = 1, originality = 1) {
        // Modify the shape according to another.
        var ctx = shape.meta.context;

        var ourPosSize = [shape.x, shape.y, shape.width, shape.height];

        var selectedShape = null;
        if(ctx !== null && (ctx.objects.length > 0)) {
            selectedShape = EMath.rsample(ctx.objects);
        }

        var beNovel = EMath.random() < novelty;

        // Then modified by a morphing factor.
        var morphPercent = EMath.random() * originality;

        var newPosSize = ourPosSize;

        if(beNovel) {
            // True if novelty is higher
            selectedShape = null;

            // Randomly adjust by a color.
            newPosSize = adjustmentPSAdjust(ourPosSize, morphPercent);
        }

        if(selectedShape !== null) {
            // Base of selected shape.
            var theirPosSize = [selectedShape.x, selectedShape.y, selectedShape.width, selectedShape.height];
            // Morph between the colors.
            newPosSize = adjustmentPSMorph(ourPosSize, theirPosSize, morphPercent);
        }

        // Position...
        shape.x = newPosSize[0];
        shape.y = newPosSize[1];
        shape.width = newPosSize[2];
        shape.height = newPosSize[3];

        return shape;
    }

    function adjustmentBeliefSingle(shape, param, novelty = 1, originality = 1, target = 0, adherence = 0) {
        // Modify the shape according to another.
        var ctx = shape.meta.context;

        var ourColor = Reflect.get(shape, param);

        var selectedShape = null;
        if(ctx !== null) {
            selectedShape = EMath.rsample(ctx.objects);
        }

        var beNovel = EMath.random() < novelty;

        // Then modified by a morphing factor.
        var morphPercent = EMath.random() * originality;

        var newColor = ourColor;

        if(beNovel) {
            // True if novelty is higher
            selectedShape = null;

            // Randomly adjust by a color.
            newColor = ourColor + (2*EMath.random() - 1) * morphPercent;
        }

        if(selectedShape !== null) {
            // Base of selected shape.
            var theirColor = Reflect.get(selectedShape, param);
            // Morph between the colors.
            newColor = ourColor * (1 - morphPercent) + theirColor * (morphPercent);
        }

        console.log("SWTar: ", target)
        console.log("SWAdh: ", adherence)

        var colMorph = helperAdd(helperMul(target, adherence), helperMul(newColor, 1-adherence));

        Reflect.set(shape, param, colMorph);
        return shape;
    }

    // Shape-based generator.
    function shapeMeld(shape) {
        // Position & size
        var posOrig = myself.beliefs.posSize.originality;
        var posNov = myself.beliefs.posSize.novelty;
        var posConc = myself.beliefs.posSize.concreteness;

        // When concreteness is lower, higher chance of being true.
        if(EMath.random() > posConc)
            shape = adjustmentBeliefPosition(shape, posNov, posOrig);

        // Fill color
        var fillOrig = myself.beliefs.fill.originality;
        var fillNov = myself.beliefs.fill.novelty;
        var fillConc = myself.beliefs.fill.concreteness;

        // When asked to be concrete.
        if(EMath.random() > fillConc) {
            shape = adjustmentBeliefColor(shape, "fill", fillNov, fillOrig,
                                          myself.desires.constantDesires.fill.target, myself.desires.constantDesires.fill.adherence);
        }

        // Stroke color
        var strokeOrig = myself.beliefs.stroke.originality;
        var strokeNov = myself.beliefs.stroke.novelty;
        var strokeConc = myself.beliefs.stroke.concreteness;

        if(EMath.random() > strokeConc) {
            shape = adjustmentBeliefColor(shape, "stroke", strokeNov, strokeOrig,
                                         myself.desires.constantDesires.stroke.target, myself.desires.constantDesires.stroke.adherence);
        }

        // Stroke width
        var strokeWidthOrig = myself.beliefs.strokeWidth.originality;
        var strokeWidthNov = myself.beliefs.strokeWidth.novelty;
        var strokeWidthConc = myself.beliefs.strokeWidth.concreteness;

        if(EMath.random() > strokeWidthConc) {
            shape = adjustmentBeliefSingle(shape, "strokeWidth", strokeWidthNov, strokeWidthOrig,
                                         myself.desires.constantDesires.strokeWidth.target, myself.desires.constantDesires.strokeWidth.adherence);
        }

        return shape;
    }

    // Base ourselves off a shape belief - then position according to data.
    var gConcrete = myself.desires.creativity.concreteness;
    var gNovel = myself.desires.creativity.novelty;
    var gOriginal = myself.desires.creativity.originality;

    // Number of shapes to generate, then generate the shapes
    var numShapes = EMath.randRange(myself.desires.number.min, myself.desires.number.max);

    // Shape only model
    function shapeOnlyModel() {
        var startCluster = EMath.rsample(myself.beliefs.basisBelief);

        var startShape;
        if(startCluster.objects.length === 0) {
            // Then set our basis to be just a random shape
            startShape = startingShapeBelief();
        }
        else {
            startShape = EMath.rsample(startCluster.objects);
        }

        // Check ultimate novelty before creating (basis, context)
        var firstShape = startingShapeBelief(startShape, startCluster);

        // If we decide to be more novel with generation...
        if(EMath.random() < gNovel) {
            // Start off with nothing if told to be more novel.
            firstShape = startingShapeBelief();
        }

        var lastShape = firstShape;

        var model = new NeuralImageModel();

        if(EMath.random() < gConcrete) {
            numShapes = myself.desires.number.target;
        }

        for(var i = 0; i < numShapes; i++) {
            console.log("Iteration "+i);
            // Modify the first shape, and then add to the shapes list
            lastShape = shapeMeld(lastShape);
            console.log("LSF:", lastShape.fill);

            // Add
            model.objects.push(lastShape);

            // Continue with a new model.
            lastShape = continuingShapeBelief(lastShape, gConcrete, gOriginal);
        }

        return model;
    }


    // Clustered model
    function clusteredModel() {
        var startCluster = EMath.rsample(myself.beliefs.basisBelief);

        var newModel = new NeuralImageModel();

        console.log("Cluster model");

        for(var i = 0; i < startCluster.objects.length; i++) {
            var copyShape = startCluster.objects[i];

            var newShape = startingShapeBelief(copyShape, startCluster);

            console.log(newShape.x);

            newShape = shapeMeld(newShape);

            console.log(newShape.fill);

            newModel.objects.push(newShape);
        }

        console.log(newModel);

        return newModel;
    }

    // Less than means a yes
    var clusterDesire = Math.random() < myself.desires.creativity.clustering;

    var ultimateModel = (clusterDesire)? clusteredModel() : shapeOnlyModel();

    console.log("Ult: ", ultimateModel);

    return ultimateModel;
}