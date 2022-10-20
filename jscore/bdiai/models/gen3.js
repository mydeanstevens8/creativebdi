function IntentionLineModel(bdim) {
    var model = new NeuralImageModel(); // Full image object
    console.log("Line generator!", bdim);
    bdim.intentions.lines.startBranch(bdim, model);
    return model;
}