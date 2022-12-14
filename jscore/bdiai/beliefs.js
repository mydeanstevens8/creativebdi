"use strict"

const beliefs = {
    // Concrete beliefs (clusters)
    posSize: {
        data: [],  // Sets of quality data
        cluster: [], // Clusters generated by ML
        novelty: 0,  // How random should our data be?
        originality: 0,  // Should our data be based on blends or unique points? 1 for blends.
        concreteness: 1, // 1 for data points, 0 for clusters. Anything in between a hybrid.
        clustering: 0,  // Whether to use something in a cluster.
    },
    fill:  {
        data: [],  // Sets of quality data
        cluster: [], // Clusters generated by ML
        novelty: 0,  // How random should our data be?
        originality: 0,  // Should our data be based on blends or unique points? 1 for blends.
        concreteness: 1, // 1 for data points, 0 for clusters. Anything in between a hybrid.
        clustering: 0,  // Whether to use something in a cluster.
    },
    stroke:  {
        data: [],  // Sets of quality data
        cluster: [], // Clusters generated by ML
        novelty: 0,  // How random should our data be?
        originality: 0,  // Should our data be based on blends or unique points? 1 for blends.
        concreteness: 1, // 1 for data points, 0 for clusters. Anything in between a hybrid.
        clustering: 0,  // Whether to use something in a cluster.
    },
    strokeWidth:  {
        data: [],  // Sets of quality data
        cluster: [], // Clusters generated by ML
        novelty: 0,  // How random should our data be?
        originality: 0,  // Should our data be based on blends or unique points? 1 for blends.
        concreteness: 1, // 1 for data points, 0 for clusters. Anything in between a hybrid.
        clustering: 0,  // Whether to use something in a cluster. (Gen 2)
    },

    number: {
        data: [],
        cluster: []
    },

    type: {
        data: [],
    },

    // These models are collective images that have shapes inside them.
    basisBelief: [], // A bare list of models of which we can base our creative drawings from.
    
    clips: {
        hardXMin: 0,
        hardYMin: 0,
        hardXMax: 1000,
        hardYMax: 1000,
        
        hardSizeMin: 0,
        hardSizeMax: 500,
        
        // Stroke width
        hardStrWMin: 0,
        hardStrWMax: 100,
        
        hardColorRange: 256,
    },
    
    // Template: {"image", "data"}
    image: {
        ratings: [],
        emotions: [],
    },
    
    // Beliefs about the last shape for line drawing
    lastShape: null,
};

function BDIBeliefs() {
    
}
Object.assign(BDIBeliefs.prototype, beliefs);
