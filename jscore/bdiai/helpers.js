"use strict"

const W3_SVGXMLNS_2 = "http://www.w3.org/2000/svg";

var svgInjectLocation = "svg#paintMain";

// Helpers
function helperProcessColor(colorProp) {
    // For color, we do some processing on it using a CS trick
    var processDiv = document.createElement("div");

    document.body.append(processDiv);

    // A platform-independent (theoretically) behavior
    processDiv.style.color = colorProp;
    var compstyle = window.getComputedStyle(processDiv);
    var colorString = compstyle.getPropertyValue("color");

    // Split into parts and process (indexing starts at the letter after the starting bracket)
    var fcontent = colorString.substring(colorString.indexOf("(")+1, colorString.lastIndexOf(")"))

    var elems = fcontent.split(",")

    var rawColor = [1, 1, 1, 1]
    
    var index;
    for(index = 0; index < elems.length; index++) {
        var elem = elems[index]
        rawColor[index] = parseFloat(elem);
    }

    // Remove the processor
    document.body.removeChild(processDiv);
    
    return rawColor;
}

// Create the model from the SVG image presented to the user
function helperCreateNeuralImageModel() {
    var svgImageLayer = $(svgInjectLocation);
    if(svgImageLayer != null) {
        var masterElement = svgImageLayer.find(".master")

        var imageModel = new NeuralImageModel()

        // Pull out every rectangle and ellipse - we support those shapes
        var children = masterElement.children()

        // Very important that we do so in order.
        children.each( function(index) {
            var modelObject = new NeuralObject()
            
            var nodeName = $(this).prop("nodeName")

            // Check the type!
            if(nodeName == 'rect') {
                modelObject.type = NeuralObjectTypes.RECTANGLE;

                // Pull out every supported attribute out of this rectangle
                var x = parseFloat($(this).attr("x"));
                var y = parseFloat($(this).attr("y"));
                var w = parseFloat($(this).attr("width"));
                var h = parseFloat($(this).attr("height"));

                var stroke = helperProcessColor($(this).attr("stroke"));
                var fill = helperProcessColor($(this).attr("fill"));
                var swidth = parseFloat($(this).attr("stroke-width"));

                modelObject.x = x;
                modelObject.y = y;
                modelObject.width = w;
                modelObject.height = h;

                modelObject.stroke = stroke;
                modelObject.fill = fill;
                modelObject.strokeWidth = swidth;
            }
            
            if(nodeName == 'ellipse') {
                modelObject.type = NeuralObjectTypes.ELLIPSE;

                // Pull out every supported attribute out of this rectangle
                var cx = parseFloat($(this).attr("cx"));
                var cy = parseFloat($(this).attr("cy"));
                var rx = parseFloat($(this).attr("rx"));
                var ry = parseFloat($(this).attr("ry"));

                var stroke = helperProcessColor($(this).attr("stroke"));
                var fill = helperProcessColor($(this).attr("fill"));
                var swidth = parseFloat($(this).attr("stroke-width"));

                modelObject.x = cx - rx;
                modelObject.y = cy - ry;
                modelObject.width = 2*rx;
                modelObject.height = 2*ry;

                modelObject.stroke = stroke;
                modelObject.fill = fill;
                modelObject.strokeWidth = swidth;
            }
            
            if(nodeName == 'circle') {
                modelObject.type = NeuralObjectTypes.ELLIPSE;

                // Pull out every supported attribute out of this rectangle
                var cx = parseFloat($(this).attr("cx"));
                var cy = parseFloat($(this).attr("cy"));
                var r = parseFloat($(this).attr("r"));

                var stroke = helperProcessColor($(this).attr("stroke"));
                var fill = helperProcessColor($(this).attr("fill"));
                var swidth = parseFloat($(this).attr("stroke-width"));

                modelObject.x = cx - r;
                modelObject.y = cy - r;
                modelObject.width = 2*r;
                modelObject.height = 2*r;

                modelObject.stroke = stroke;
                modelObject.fill = fill;
                modelObject.strokeWidth = swidth;
            }
            
            imageModel.objects.push(modelObject)
        });
        
        // Model is done
        return imageModel;
    }
    
    return null;
}

function helperJitter(data, diff) {
    var newPoints = [];
    for(var j = 0; j < data.length; j++) {
        var newPoint;
        if(Array.isArray(data[j])) {
            newPoint = [];
            for(var i = 0; i < data[j].length; i++) {
                // Square-based random-ness for each point.
                newPoint.push(data[j][i] + ((EMath.random()*2 - 1) * diff));
            }
        }
        else{
            newPoint = data[j] + ((EMath.random()*2 - 1) * diff);
        }
        
        newPoints.push(newPoint);
    }
    
    return newPoints;
}

function helperGenerateStochastic(point, n, diff) {
    var newPoints = [];
    for(var j = 0; j < n; j++) {
        var newPoint;
        if(Array.isArray(point)) {
            newPoint = [];
            for(var i = 0; i < point.length; i++) {
                // Square-based random-ness for each point.
                newPoint.push(point[i] + ((EMath.random()*2 - 1) * diff));
            }
        }
        else{
            newPoint = point + ((EMath.random()*2 - 1) * diff);
        }
        
        newPoints.push(newPoint);
    }
    
    return newPoints;
}


function helperSortAugment(pArray) {
    var compfunc = function(a, b) {
        return a.dist - b.dist;
    };
    
    return pArray.sort(compfunc);
}

function helperAugmentDistance(point, data) {
    var dist = helperDistanceEuclid(point, data);
    
    var aug = [];
    for(var i = 0; i < dist.length; i++) {
        var indiv = data[i];
        var indist = dist[i];
        
        aug.push({data: indiv, dist: indist});
    }
    return aug;
}


function helperDistanceEuclid(point, data) {
    // Compute distance to every point.
    
    var distances = []
    
    for(var i = 0; i < data.length; i++) {
        var other = data[i]
        distances.push(Math.sqrt(helperLocalEucDist2(point, other)));
    }
    
    return distances;
}

function helperLocalDist(point1, point2) {
    if(Array.isArray(point1)) {
        var arrayRet = [];
        for(var i = 0; i < point1.length; i++) {
            var a = point1[i];
            var b = point2[i];
            
            arrayRet.push(b - a);
        }
        
        return arrayRet;
    }
    else{
        return point2 - point1;
    }
}


function helperLocalEucDist2(point1, point2) {
    if(Array.isArray(point1)) {
        var arrayS = 0;
        for(var i = 0; i < point1.length; i++) {
            var a = point1[i];
            var b = point2[i];
            
            arrayS += (b - a) * (b - a);
        }
        return arrayS;
    }
    else{
        return (point2 - point1) * (point2 - point1);
    }
}

function helperMul(vector, scalar) {
    if(Array.isArray(vector)) return vector.map(a => a*scalar);
    else return vector * scalar;
}


function helperAdd(a, b) {
    if(Array.isArray(a)) return a.map((e, i) => e + b[i]);
    else return a+b;
}


function helperSub(a, b) {
    if(Array.isArray(a)) return a.map((e, i) => e - b[i]);
    else return a-b;
}

function helperMulVe(a, b) {
    if(Array.isArray(a)) return a.map((e, i) => e * b[i]);
    else return a*b;
}

function helperDivVe(a, b) {
    if(Array.isArray(a)) return a.map((e, i) => e / b[i]);
    else return a/b;
}

function helperBareMin(a) {
    // Check if we have a list of vectors.
    if(Array.isArray(a[0])) {
        var bareMin = [];
        for(var i = 0; i < a[0].length; i++) {
            bareMin.push(Math.min.apply(Math, a.map(a => a[i])));
        }
        return bareMin;
    }
    return Math.min.apply(Math, a);
}

function helperBareMax(a) {
    // Check if we have a list of vectors.
    if(Array.isArray(a[0])) {
        var bareMax = [];
        for(var i = 0; i < a[0].length; i++) {
            bareMax.push(Math.max.apply(Math, a.map(a => a[i])));
        }
        return bareMax;
    }
    return Math.max.apply(Math, a);
}


// Unsupervised machine learning
// Distance optimisation - clump into groups.
// K nearest approximation: K is the stopping criterion.
// This is a basic k-means clustering algorithm.
function helperHotspotModel(dim, data, k=4, clusters=10, epsilon=0.05, epoch=50, j = 12, prefillClusters = null) {
    // Generate the clusters.

    // We try to classify the data into k different clusters.
    var myClusters = []

    for(var i = 0; i < clusters; i++) {
        var localPoint;

        // Assign randomly to a data point if not prefilled.
        if((prefillClusters != null) && (i < prefillClusters.length)) {
            // Prefill our data if we have some.
            localPoint = (prefillClusters[i]);
        }
        else {
            // Otherwise, we make a new one from the data.
            var randomVal = Math.floor(EMath.random() * (data.length));
            localPoint = data[randomVal];
        }

        // Then, we use SGD to get there, with k being our chosen target.
        var ck = k;  // Points to select
        var cEps = epsilon;
        var cj = j;

        // Main learning loop.
        for(var e = 0; e < epoch; e++) {
            // Select the k nearest points to us. Then try j points near us to reduce distance.
            var dist = helperDistanceEuclid(localPoint, data).sort().slice(0, ck);

            // Sum the distances together to get our error measurement.
            var currentErrMeasure = dist.reduce((a, b) => a+b, 0);

            // Generate stochastic points around the point to try for a direction to reduce distances.
            var otherErrMeasures = [];

            var stoPoints = helperGenerateStochastic(localPoint, cj, epsilon);

            var stoChoice = [];

            // Then, test these points too
            for(var l = 0; l < stoPoints.length; l++) {
                var stoDist = helperDistanceEuclid(stoPoints[l], data).sort().slice(0, ck);
            
                var stoErrMeasure = stoDist.reduce((a, b) => a+b, 0);

                stoChoice.push({data:stoPoints[l], dist: stoErrMeasure});
            }
            

            // Then grab the selected choice that minimises distance
            var stoSelectedChoice = helperSortAugment(stoChoice)[0];

            // And learn via stochastic gradient (k-means) descent.

            // Calculate the movement towards the other point.
            var rawMovement = helperLocalDist(localPoint, stoSelectedChoice.data);

            rawMovement = helperMul(rawMovement, currentErrMeasure);
            
            // Update the point by moving by this much.
            localPoint = helperAdd(localPoint, rawMovement);
        }

        // Push the point!
        myClusters.push(localPoint);

    }

    return myClusters;
}

function helperHotspotCompressClusters(clusters, r=10) {
    var curCl = clusters;
    var newCl = curCl;
    // For each point, find the smallest distance to another.
    for(var i = 0; i < curCl.length; i++) {
        var augdists = helperDistanceEuclid(curCl[i], curCl);
        
        // Inverse distance places more importance on the nearest points
        augdists.map(a => 1/Math.max(0.01, a));
        
        // Do not consider one's own point
        augdists[i] = 0;
        
        // Total sum
        var totalWeight = augdists.reduce((a,b) => a+b);
        
        // Multiply by the total weight to get a proportion measure
        augdists = helperMul(augdists, 1/totalWeight);
        
        var proportions = curCl.map((a,i) => helperMul(a, augdists[i]));
        
        var target = proportions.reduce((a,b) => helperAdd(a, b));
        
        newCl[i] = target;
    }
    return newCl;
}

// Compress using smallest distance reduction until nothing exists.
function helperHotspotCompressClusters2Impl(c) {
    var dist = [];
    // For each point, find the smallest distance to another.
    for(var i = 0; i < c.length; i++) {
        for(var j = i+1; j < c.length; j++) {
            var distObj = {a: i, b: j, dist: helperLocalEucDist2(c[i],c[j])};
            
            dist.push(distObj);
        }
    }
    
    // Smallest distance disappears, with a new cluster generated
    var elim = helperSortAugment(dist)[0];
    
    var ed = elim.dist;
    
    var nc = [];
    
    for(var i = 0; i < c.length; i++) {
        if(i !== elim.a && i !== elim.b) {
            // Ensure that we're not eliminating them
            nc.push(c[i]);
        }
    }
    
    // For the eliminated point, we plot the average.
    nc.push(helperMul(helperAdd(c[elim.a], c[elim.b]), 0.5))
    
    return {data: nc, dist: ed};
}

function helperHotspotCompressClusters2(clusters, diff=0.1, minClusters = 4) {
    var lastDist = 0;
    var curClusters = clusters;
    
    // Keep going until this
    while((lastDist < diff) && (curClusters.length > minClusters)) {
        var res = helperHotspotCompressClusters2Impl(curClusters);
        
        curClusters = res.data;
        
        // Assert, should never decrease.
        lastDist = res.dist;
    }
    
    return curClusters;
}

function smartHotspotLearn(data, k=4, clusters=10, epsilon=0.05, epoch=50, j = 12, diff=0.1, minClusters=4, prefillClusters = null) {
    var dim = 1;
    if(Array.isArray(data[0])) dim = data[0].length;
    var clusters = helperHotspotModel(dim, data, k, clusters, epsilon, epoch, j, prefillClusters);
    
    clusters = helperHotspotCompressClusters2(clusters, diff, minClusters);
    
    return clusters;
}

function generateClusters(data, k=5, clusters=20, epsilon=0.05, epoch=100, j = 16, diff=0.1, minClusters=2, prefillClusters = null) {
    return smartHotspotLearn(data, k, clusters, epsilon, epoch, j, diff, minClusters, prefillClusters);
}


// Write a neural image model to SVG!
function helperWriteNeuralImageModel(nim, clear=true) {
    var svgImageLayer = $(svgInjectLocation);
    var masterElement = svgImageLayer.find(".master");
    
    // Clear before doing if specified
    if(clear) {
        masterElement.empty();
    }
    // Shouldn't be too difficult
    var index;
    console.log(nim);
    for(index = 0; index < nim.objects.length; index++) {
        // What's this element, and all associated data
        var obj = nim.objects[index];
        
        var type = obj.type
        var x = obj.x
        var y = obj.y
        var w = obj.width
        var h = obj.height
        
        var stroke = obj.stroke
        var fill = obj.fill
        var sw = obj.strokeWidth
        
        // Process the color once again.
        var strokec = "rgba("+stroke[0]+","+stroke[1]+","+stroke[2]+","+stroke[3]+")";
        var fillc = "rgba("+fill[0]+","+fill[1]+","+fill[2]+","+fill[3]+")";
        
        var elT;
        // Based on type, fill it out
        if(type == NeuralObjectTypes.RECTANGLE) {
            elT = document.createElementNS(W3_SVGXMLNS_2, "rect");
            
            elT.setAttribute("x", x);
            elT.setAttribute("y", y);
            elT.setAttribute("width", w);
            elT.setAttribute("height", h);
        }
        
        // Based on type, fill it out
        if(type == NeuralObjectTypes.ELLIPSE) {
            elT = document.createElementNS(W3_SVGXMLNS_2, "ellipse");
            
            elT.setAttribute("cx", x + w/2);
            elT.setAttribute("cy", y + h/2);
            elT.setAttribute("rx", w/2);
            elT.setAttribute("ry", h/2);
        }
        
        if(elT != null) {
            elT.setAttribute("stroke", strokec);
            elT.setAttribute("fill", fillc);
            elT.setAttribute("stroke-width", sw);
            
            masterElement[0].appendChild(elT);
        }
    }
}

const EMath = {
    rSeed: 0,
    randRange(min, max) {
        return EMath.random() * (max - min) + min;
    },
    rsample(data) {
        return data[Math.floor(EMath.randRange(0, data.length))];
    },
    clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    },
    
    // Range is 0 inc. to val exc.
    applyDiscreteVariance(val) {
        return Math.floor(EMath.random() * val)
    },
    
    generateRandomRGBA() {
        return [EMath.randRange(0, 255), EMath.randRange(0, 255), EMath.randRange(0, 255), EMath.randRange(0, 255)];
    },
    
    random() {
        return Math.random();
    },
}
