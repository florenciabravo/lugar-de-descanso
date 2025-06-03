package com.lugardedescanso.service.impl;

import com.lugardedescanso.entity.Category;
import com.lugardedescanso.repository.CategoryRepository;
import com.lugardedescanso.service.CategoryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    // Ruta configurable
    @Value("${category.images.upload-dir:uploads/categories}")
    private String uploadDir;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category addCategory(String title, String description, MultipartFile imageFile) throws IOException {
        // Crear carpeta si no existe
        Files.createDirectories(Paths.get(uploadDir));

        // Generar nombre único para la imagen
        String imageName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

        // Ruta final del archivo
        String imagePath = uploadDir + File.separator + imageName;

        // Guardar el archivo en disco
        Files.write(Paths.get(imagePath), imageFile.getBytes());

        // Construir la URL
        String imageUrl = "/images/categories/" + imageName;

        // Crear categoría
        Category category = Category.builder()
                .title(title)
                .description(description)
                .imageUrl(imageUrl)
                .build();

        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
