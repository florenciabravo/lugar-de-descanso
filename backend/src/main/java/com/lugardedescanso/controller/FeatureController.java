package com.lugardedescanso.controller;

import com.lugardedescanso.entity.Feature;
import com.lugardedescanso.service.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/features")
public class FeatureController {

    @Autowired
    private FeatureService featureService;

    @PostMapping
    public ResponseEntity<Feature> addFeature(
            @RequestParam("name") String name,
            @RequestParam("icon") MultipartFile icon) {

        Feature savedFeature = featureService.addFeature(name, icon);
        return ResponseEntity.ok(savedFeature);
    }

    @GetMapping
    public ResponseEntity<List<Feature>> getAllFeatures() {
        List<Feature> features = featureService.getAllFeatures();
        return ResponseEntity.ok(features);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeature(@PathVariable Long id) {
        featureService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feature> getFeatureById(@PathVariable Long id) {
        Feature feature = featureService.getFeatureById(id);
        return ResponseEntity.ok(feature);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feature> updateFeature(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "icon", required = false) MultipartFile icon) {

        Feature updatedFeature = featureService.updateFeature(id, name, icon);
        return ResponseEntity.ok(updatedFeature);
    }
}
