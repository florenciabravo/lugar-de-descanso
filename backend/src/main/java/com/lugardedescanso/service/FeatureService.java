package com.lugardedescanso.service;

import com.lugardedescanso.entity.Feature;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FeatureService {
    Feature addFeature(String name, MultipartFile icon);
    List<Feature> getAllFeatures();
    void deleteFeature(Long id);
    Feature getFeatureById(Long id);
    Feature updateFeature(Long id, String name, MultipartFile icon);
}
