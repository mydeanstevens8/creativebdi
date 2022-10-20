"use strict"

const desires = {
    // Desire to ask questions to the user as a probability
    questions: 0.25,

    // Desire to give the user feedback
    feedback: 0.25,

    // Desires for shape generation
    number: {
        min: 1,
        target: 8,
        max: 64,
        
        clusters: 2,
        clusterVariance: 2,
    },

    // Desires to create better images:
    creativity: {
        novelty: 0,  // Controls global variance
        originality: 0,  // Controls blending
        concreteness: 1,  // Controls precision
        
        clustering: 1,
    },
    
    // Color choice desires (to generate creative images with specific colors)
    constantDesires: {
        fill: {
            target: [0, 0, 0, 0],
            adherence: 0
        },
        stroke: {
            target: [0, 0, 0, 0],
            adherence: 0
        },
        strokeWidth: {
            target: 3,
            adherence: 0
        }
    },
    
    // Line drawer desires! The innovative creative line tool
    lines: {
        pos: {
            length: {
                target: 1000,
                var: 200,  // Variance here is not a normal dist, but is in fact simulating a uniform distribution in both directions.
            },
            step: {
                target: 50,
                var: 10
            },
            deviance: {
                target: 5,
                var: 5
            },
            branching: {
                probability: 0.2,
                deviance: {
                    target: 0,
                    var: 60
                },
                
                startBranches: 3,
                midBranches: 2,
            },
            start: {
                x: 500,
                y: 500,
                varX: 100,
                varY: 100
            }
        },
        // Fill color
        color: {
            startFromBelief: false,
            startDesire: [0, 0, 0, 1],
            randomWalk: {
                target: 10,
                var: 5
            },
            randomVar: {
                target: 10,
                var: 5
            },
            // Use random walk if true, otherwise stay at var.
            walkMode: true,
            // Applies to alpha values as well when non-zero.
            alphaScalar: 0
        },
        strokeColor: {
            startFromBelief: false,
            startDesire: [0, 0, 0, 1],
        },
        strokeWidth: {
            startFromBelief: false,
            startDesire: 2,
        },
        
        shapeType: {
            startFromBelief: false,
            startDesire: 1,
        },
        
        size: {
            default: 64
        }
    },
    
    // Choice of model to use.
    model: 1
};

function BDIDesires() {}
Object.assign(BDIDesires.prototype, desires);
