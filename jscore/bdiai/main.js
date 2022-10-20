"use strict"

// For debug.
var globalHotspot = null;

$(document).ready(function(){
    Math.seedrandom(0);
    
    var hotspotModel = new Hotspots();
    
    hotspotModel.init();
    
    // Listen to some events
    $(".saveImage").click(function() {
        hotspotModel.performSaveStep();
        
        // Deselect everything
        if(painter) painter.updateSelection(null);
    });
    
    $(".saveModel").click(function() {
        hotspotModel.saveBDIToStore();
        
        // Deselect everything
        if(painter) painter.updateSelection(null);
    });
    
    $(".generateModel").click(function() {
        hotspotModel.generateAndWriteModel();
        
        // Deselect everything
        if(painter) painter.updateSelection(null);
    });
    
    
    $(".askQuestion").click(function() {
        hotspotModel.askQuestion();
    });
    
    
    $(".deleteModel").click(function() {
        var confirmation = confirm("Delete all model data? This can't be undone.");
        if(confirmation) {
            hotspotModel.clearAllModels();
        }
        
        // Deselect everything
        if(painter) painter.updateSelection(null);
    });
    
    $(".deleteBDI").click(function() {
        var confirmation = confirm("Delete the BDI model? This can't be undone.");
        if(confirmation) {
            hotspotModel.clearBDIModel();
        }
        
        // Deselect everything
        if(painter) painter.updateSelection(null);
    });
    
    globalHotspot = hotspotModel;
});