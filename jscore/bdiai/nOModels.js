"use strict"

const NeuralObjectTypes = {
    RECTANGLE: 0,
    ELLIPSE: 1,
}

// Object for the image model
const neuralObject = {
    type: NeuralObjectTypes.RECTANGLE,
    
    x: 0,
    y: 0,
    
    width: 0,
    height: 0,
    
    // Red, green, blue, as a float from 0 to 1
    // In order: RGBA
    fill: [0, 0, 0, 0],
    stroke: [0, 0, 0, 0],
    
    strokeWidth: 0,
}

function NeuralObject () {
    // Nothing to do here
}
Object.assign(NeuralObject.prototype, neuralObject)

// An image object, with resultant creativity scores.
// This exists in our memory
const neuralImageModel = {
    // Objects of type NeuralObject.
    objects: [],
    
    // Score for the object: How much weight should we take into the object?
    score: 1,
}

function NeuralImageModel () {
    this.objects = []
}
Object.assign(NeuralImageModel.prototype, neuralImageModel)
