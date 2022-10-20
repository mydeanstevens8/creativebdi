const intentions = {
    whole: {
        generateSingle(bdim) {
            // Select a model at random
            var randomSel = Math.floor(EMath.random() * (bdim.beliefs.basisBelief.length));

            var selected = bdim.beliefs.basisBelief[randomSel];
            return selected;
        },
        generateMultiple(bdim, n) {
            // Select a model at random
            var multis = [];

            for(var i = 0; i < n; i++) {
                var localModel = bdim.intentions.whole.generateSingle(bdim);
                for(var j = 0; j < localModel.objects.length; j++) {
                    multis.push(localModel.objects[j]);
                }
            }

            var nim = new NeuralImageModel();
            nim.objects = multis;

            return nim;
        },
    },
    shape: {
        generateFromDataBelief(bdim) {
            // From the data belief, we select a random shape to be sent.
            var posData = bdim.beliefs.posSize.data;
            var fillData = bdim.beliefs.fill.data;
            var strokeData = bdim.beliefs.stroke.data;
            var swData = bdim.beliefs.strokeWidth.data;
            var typeData = bdim.beliefs.type.data;

            // Random for each category.
            var rPS = EMath.rsample(posData);
            var rFill = EMath.rsample(fillData);
            var rStroke = EMath.rsample(strokeData);
            var rSWidth = EMath.rsample(swData);
            var rT = EMath.rsample(typeData);

            // Create position
            var shape = new NeuralObject();
            bdim.intentions.mods.fillNewPosSize(bdim, shape, rPS);

            // Color
            shape.fill = rFill;
            shape.stroke = rStroke;
            shape.strokeWidth = rSWidth;

            shape.type = rT;

            return shape;
        },

        generateFromClusterBelief(bdim) {
            // From the data belief, we select a random shape to be sent.
            var posData = bdim.beliefs.posSize.cluster;
            var fillData = bdim.beliefs.fill.cluster;
            var strokeData = bdim.beliefs.stroke.cluster;
            var swData = bdim.beliefs.strokeWidth.cluster;

            // Only type is generated from data.
            var typeData = bdim.beliefs.type.data;

            // Random for each category.
            var rPS = EMath.rsample(posData);
            var rFill = EMath.rsample(fillData);
            var rStroke = EMath.rsample(strokeData);
            var rSWidth = EMath.rsample(swData);
            var rT = EMath.rsample(typeData);

            // Create position
            var shape = new NeuralObject();
            bdim.intentions.mods.fillNewPosSize(bdim, shape, rPS);

            // Color
            shape.fill = rFill;
            shape.stroke = rStroke;
            shape.strokeWidth = rSWidth;

            shape.type = rT;

            return shape;
        },

        generateFromNovelBelief(bdim) {
            // Only type is generated from data here.
            var typeData = bdim.beliefs.type.data;

            // Position is generated from the cluster.
            var posData = bdim.beliefs.posSize.cluster;
            var rPS = EMath.rsample(posData);

            // Create new shape
            var shape = new NeuralObject();

            bdim.intentions.mods.fillNewPosSize(bdim, shape, rPS);

            var rT = EMath.rsample(typeData);

            // Color
            shape.fill = [
                EMath.randRange(0, bdim.beliefs.clips.hardColorRange), 
                EMath.randRange(0, bdim.beliefs.clips.hardColorRange), 
                EMath.randRange(0, bdim.beliefs.clips.hardColorRange),
                EMath.randRange(0, bdim.beliefs.clips.hardColorRange)
            ];
            shape.stroke = [
                EMath.randRange(0, bdim.beliefs.clips.hardColorRange), 
                EMath.randRange(0, bdim.beliefs.clips.hardColorRange), 
                EMath.randRange(0, bdim.beliefs.clips.hardColorRange),
                EMath.randRange(0, bdim.beliefs.clips.hardColorRange)
            ];
            shape.strokeWidth = EMath.randRange(bdim.beliefs.clips.hardStrWMin, bdim.beliefs.clips.hardStrWMax);

            shape.type = rT;

            return shape;
        },

        generateSetFromDataBelief(bdim, n) {
            var nim = new NeuralImageModel();

            for(var i = 0; i < n; i++) {
                var shape = bdim.intentions.shape.generateFromDataBelief(bdim);
                nim.objects.push(shape);
            }

            return nim;
        },
        generateSetFromClusterBelief(bdim, n) {
            var nim = new NeuralImageModel();

            for(var i = 0; i < n; i++) {
                var shape = bdim.intentions.shape.generateFromClusterBelief(bdim);
                nim.objects.push(shape);
            }

            return nim;
        },
        generateSetFromNovelBelief(bdim, n) {
            var nim = new NeuralImageModel();

            for(var i = 0; i < n; i++) {
                var shape = bdim.intentions.shape.generateFromNovelBelief(bdim);
                nim.objects.push(shape);
            }

            return nim;
        }
    },
    mods: {
        fillNewPosSize(bdim, shape, pos) {
            shape.x = pos[0];
            shape.y = pos[1];
            shape.width = pos[2];
            shape.height = pos[3];

            return shape;
        },
        clampValues(bdim, shape) {
            // Clamp those that need to be clamped.
            shape.fill = EMath.clamp(shape.fill, 0, bdim.beliefs.clips.hardColorRange);
            shape.stroke = EMath.clamp(shape.stroke, 0, bdim.beliefs.clips.hardColorRange);
            shape.strokeWidth = EMath.clamp(shape.strokeWidth, bdim.beliefs.clips.hardStrWMin, bdim.beliefs.clips.hardStrWMax);

            return shape;
        },
        clampAll(bdim, img) {
            for(var i = 0; i < img.objects.length; i++) {
                img.objects[i] = bdim.intentions.mods.clampValues(img.objects[i])
            }

            return img;
        },

        modifyFill(bdim, shape, val) {
            shape.fill = val;
            return shape;
        },
        modifyStroke(bdim, shape, val) {
            shape.stroke = val;
            return shape;
        },
        modifyStrokeWidth(bdim, shape, val) {
            shape.strokeWidth = val;
            return shape;
        },

        newFillFromBelief(bdim, shape, param) {
            // Generate from parameter
            var r = EMath.rsample(param);
            shape.fill = r;

            return shape;
        },

        newStrokeFromBelief(bdim, shape, param) {
            // Generate from parameter
            var r = EMath.rsample(param);
            shape.stroke = r;

            return shape;
        },

        newStrokeWidthFromBelief(bdim, shape, param) {
            // Generate from parameter
            var r = EMath.rsample(param);
            shape.strokeWidth = r;

            return shape;
        },

        newPosSizeFromBelief(bdim, shape, param) {
            // Generate from parameter
            var r = EMath.rsample(param);
            shape.x = r[0];
            shape.y = r[1];
            shape.width = r[2];
            shape.height = r[3];

            return shape;
        },

        novelColor(range=255) {
            return [EMath.random() * range, EMath.random() * range, EMath.random() * range, EMath.random() * range];
        },

        newBeliefFill(bdim, img, param) {
            for(var i = 0; i < img.objects.length; i++) {
                img.objects[i] = bdim.intentions.mods.newFillFromBelief(bdim, img.objects[i], param);
            }
        },
        newBeliefStroke(bdim, img, param) {
            for(var i = 0; i < img.objects.length; i++) {
                img.objects[i] = bdim.intentions.mods.newStrokeFromBelief(bdim, img.objects[i], param);
            }
        },
        newBeliefStrokeWidth(bdim, img, param) {
            for(var i = 0; i < img.objects.length; i++) {
                img.objects[i] = bdim.intentions.mods.newStrokeWidthFromBelief(bdim, img.objects[i], param);
            }
        },

        doRandomFillParamSelection(bdim, shape, paramChoice) {
            if(paramChoice < 0.25) {
                return shape;  // Leave as is
            }
            else if(paramChoice < 0.5) {
                return bdim.intentions.mods.newFillFromBelief(bdim, shape, bdim.beliefs.fill.data);
            }
            else if(paramChoice < 0.75) {
                return bdim.intentions.mods.newFillFromBelief(bdim, shape, bdim.beliefs.fill.cluster);
            }
            else {
                // Completely novel
                return bdim.intentions.mods.modifyFill(bdim, shape, bdim.intentions.mods.novelColor());
            }
        },

        doRandomStrokeParamSelection(bdim, shape, paramChoice) {
            if(paramChoice < 0.25) {
                return shape;  // Leave as is
            }
            else if(paramChoice < 0.5) {
                return bdim.intentions.mods.newStrokeFromBelief(bdim, shape, bdim.beliefs.stroke.data);
            }
            else if(paramChoice < 0.75) {
                return bdim.intentions.mods.newStrokeFromBelief(bdim, shape, bdim.beliefs.stroke.cluster);
            }
            else {
                // Completely novel
                return bdim.intentions.mods.modifyStroke(bdim, shape, bdim.intentions.mods.novelColor());
            }
        },

        doRandomSWParamSelection(bdim, shape, paramChoice) {
            if(paramChoice < 0.25) {
                return shape;  // Leave as is
            }
            else if(paramChoice < 0.5) {
                return bdim.intentions.mods.newStrokeWidthFromBelief(bdim, shape, bdim.beliefs.strokeWidth.data);
            }
            else if(paramChoice < 0.75) {
                return bdim.intentions.mods.newStrokeWidthFromBelief(bdim, shape, bdim.beliefs.strokeWidth.cluster);
            }
            else {
                // Completely novel
                return bdim.intentions.mods.modifyStrokeWidth(bdim, shape, EMath.random() * bdim.beliefs.clips.hardStrWMax);
            }
        },

        doRandomMovement(bdim, shape, paramChoice, varv = 1000, varp = 250) {
            if(paramChoice < 0.25) {
                return shape;  // Leave as is
            }
            else if(paramChoice < 0.5) {
                return bdim.intentions.mods.newPosSizeFromBelief(bdim, shape, bdim.beliefs.posSize.data);
            }
            else if(paramChoice < 0.75) {
                return bdim.intentions.mods.newPosSizeFromBelief(bdim, shape, bdim.beliefs.posSize.cluster);
            }
            else {
                // Completely novel displacement
                return bdim.intentions.mods.fillNewPosSize(bdim, shape, [varv * EMath.random(), varv * EMath.random(), varp * EMath.random(), varp * EMath.random()]);
            }
        },
        morph(shape1, shape2) {
            var ns = new NeuralObject();

            // 0 or 1, randomly and independently.
            ns.type = EMath.applyDiscreteVariance(2);

            ns.x = (shape1.x + shape2.x) / 2;
            ns.y = (shape1.y + shape2.y) / 2;
            ns.width = (shape1.width + shape2.width) / 2;
            ns.height = (shape1.height + shape2.height) / 2;
        },
    },
    lines: {
        // Direction in degrees.
        generateBranch(bdim, model, remainingLength, currentPosition, currentColor, direction, shapeType, size, strokeColor, strokeWidth) {
            // Model objects
            while(remainingLength > 0) {
                var step = helperSampleUnif(bdim.desires.lines.pos.step);
                var deviance = helperSampleUnif(bdim.desires.lines.pos.deviance);

                var alphaChange = bdim.desires.lines.color.alphaScalar;

                // Color walks
                var cRanWF = () => helperSampleUnif(bdim.desires.lines.color.randomWalk);
                // Generate 4 random
                var cRanWC = [cRanWF(), cRanWF(), cRanWF(), alphaChange * cRanWF()];

                var cRanVF = () => helperSampleUnif(bdim.desires.lines.color.randomVar);
                // Generate 4 random
                var cRanVC = [cRanVF(), cRanVF(), cRanVF(), alphaChange * cRanVF()];

                var walkMode = bdim.desires.lines.color.walkMode;

                // Convert to rad
                var displacement = helperMul([Math.cos(direction * (Math.PI / 180)), Math.sin(direction * (Math.PI / 180))], step);

                // Update remaining length
                remainingLength -= step;

                // Update direction
                direction += (deviance - (bdim.desires.lines.pos.deviance.target / 2));  // Center it.

                // Update current position
                currentPosition = helperAdd(currentPosition, displacement);

                // Update current color
                var walkedColor = helperAdd(currentColor, walkMode? cRanWC : cRanVC);

                // Generate the shape according to strict criteria.
                var newShape = new NeuralObject();
                newShape.x = currentPosition[0];
                newShape.y = currentPosition[1];

                newShape.type = shapeType;

                newShape.width = size[0];
                newShape.height = size[1];

                newShape.fill = walkedColor;
                newShape.stroke = strokeColor;
                newShape.strokeWidth = strokeWidth;

                if(walkMode) {
                    currentColor = walkedColor;
                }

                // Add the new shape
                model.objects.push(newShape);

                var willBranch = EMath.random() < bdim.desires.lines.pos.branching.probability;

                // Check if we branch. If so, branch into two and break
                if(willBranch) {
                    var branches = bdim.desires.lines.pos.branching.midBranches;

                    var dirDev = helperSampleUnif(bdim.desires.lines.pos.branching.deviance);

                    var dirDevs = [dirDev, -dirDev, 0];

                    for(var b = 0; b < branches; b++) {
                        model = this.generateBranch(bdim, model, remainingLength, currentPosition, currentColor, 
                                       helperAdd(direction, dirDevs[b]), 
                                       shapeType, size, strokeColor, strokeWidth);
                    }

                    break;
                }

            }

            return model;
        },

        startBranch(bdim, model) {
            var rl = helperSampleUnif(bdim.desires.lines.pos.length);
            var fillColor = bdim.desires.lines.color.startDesire;
            var strokeColor = bdim.desires.lines.strokeColor.startDesire;

            var strokeWidth = bdim.desires.lines.strokeWidth.startDesire;

            var shapeType = bdim.desires.lines.shapeType.startDesire;

            var ls = bdim.beliefs.lastShape;

            // Always start at a desired position
            var pos = helperStartSamp(bdim.desires.lines.pos.start);

            // Starting from the belief
            if(bdim.desires.lines.color.startFromBelief && ls !== null) {
                fillColor = ls.fill;
            }

            if(bdim.desires.lines.strokeColor.startFromBelief && ls !== null) {
                strokeColor = ls.stroke;
            }

            if(bdim.desires.lines.strokeWidth.startFromBelief && ls !== null) {
                strokeWidth = ls.strokeWidth;
            }

            if(bdim.desires.lines.shapeType.startFromBelief && ls !== null) {
                shapeType = ls.type;
            }

            var sizeDef = bdim.desires.lines.size.default;

            var size = [sizeDef, sizeDef];

            if(ls !== null) {
                size = [ls.width, ls.height];
            }

            console.log("Starting with ls: ", ls);

            // Split into some branches here (let's say 3).
            var branches = bdim.desires.lines.pos.branching.startBranches;
            for(var i = 0; i < branches; i++) {
                // Random direction for each branch.
                var direction = EMath.random() * 360;

                // Start generating, and it goes uphill from there.
                model = this.generateBranch(bdim, model, rl, pos, fillColor, direction, shapeType, size, strokeColor, strokeWidth);
            }


            return model;
        },
    }
}

function BDIIntentions() {}
Object.assign(BDIIntentions.prototype, intentions);