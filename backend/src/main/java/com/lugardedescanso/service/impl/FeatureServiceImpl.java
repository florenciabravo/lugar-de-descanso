package com.lugardedescanso.service.impl;

import com.lugardedescanso.entity.Feature;
import com.lugardedescanso.repository.FeatureRepository;
import com.lugardedescanso.service.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class FeatureServiceImpl implements FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public Feature addFeature(String name, MultipartFile icon) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la característica no puede estar vacío");
        }

        if (icon == null || icon.isEmpty()) {
            throw new IllegalArgumentException("El ícono es obligatorio");
        }

        try {
            // Generar un nombre único para el archivo
            String originalFilename = icon.getOriginalFilename();
            String filename = System.currentTimeMillis() + "_" + originalFilename;

            // Carpeta de destino (debe existir o se crea)
            String uploadDir = "./uploads/features/";
            java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + filename);
            java.nio.file.Files.createDirectories(path.getParent());

            // Guardar el archivo
            java.nio.file.Files.write(path, icon.getBytes());

            // Crear y guardar la Feature
            Feature feature = new Feature();
            feature.setName(name);
            feature.setIconUrl("/images/features/" + filename); // URL que se puede acceder desde el frontend

            return featureRepository.save(feature);

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el ícono", e);
        }
    }

    @Override
    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }

    @Override
    public void deleteFeature(Long id) {
        if (!featureRepository.existsById(id)) {
            throw new IllegalArgumentException("La característica con ID " + id + " no existe");
        }
        featureRepository.deleteById(id);
    }

    @Override
    public Feature getFeatureById(Long id) {
        return featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica no encontrada con ID: " + id));
    }

    @Override
    public Feature updateFeature(Long id, String name, MultipartFile icon) {
        Feature existingFeature = getFeatureById(id);

        existingFeature.setName(name);

        if (icon != null && !icon.isEmpty()) {
            try {
                String filename = System.currentTimeMillis() + "_" + icon.getOriginalFilename();
                String uploadDir = "./uploads/features/";

                java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + filename);
                java.nio.file.Files.createDirectories(filePath.getParent());
                java.nio.file.Files.write(filePath, icon.getBytes());

                String iconUrl = "/images/features/" + filename;
                existingFeature.setIconUrl(iconUrl);

            } catch (IOException e) {
                throw new RuntimeException("Error al actualizar el ícono", e);
            }
        }

        return featureRepository.save(existingFeature);
    }

}
