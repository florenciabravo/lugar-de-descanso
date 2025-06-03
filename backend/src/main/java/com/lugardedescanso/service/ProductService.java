package com.lugardedescanso.service;

import com.lugardedescanso.entity.Category;
import com.lugardedescanso.entity.Feature;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.repository.CategoryRepository;
import com.lugardedescanso.repository.FeatureRepository;
import com.lugardedescanso.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;
    private final String uploadFolder = "uploads/";

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          FeatureRepository featureRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
    }

    public Product createProduct(String name, String description, Long categoryId, List<Long> featureIds, List<MultipartFile> images) throws IOException {
        if (images == null || images.isEmpty() || images.stream().allMatch(MultipartFile::isEmpty)) {
            throw new IllegalArgumentException("Se debe proporcionar al menos una imagen");
        }

        for (MultipartFile image : images) {
            if (!image.getContentType().startsWith("image/")) {
                throw new IllegalArgumentException("Solo se pueden cargar archivos de imagen");
            }
        }

        if (productRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("El nombre del producto ya está en uso");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + categoryId));

        List<String> imageUrls = saveImages(images);

        Set<Feature> features = new HashSet<>();
        if (featureIds != null && !featureIds.isEmpty()) {
            features = new HashSet<>(featureRepository.findAllById(featureIds));
        }

        Product product = Product.builder()
                .name(name)
                .description(description)
                .imageUrls(imageUrls)
                .category(category)
                .features(features)
                .build();

        return productRepository.save(product);
    }

    public List<String> saveImages(List<MultipartFile> images) throws IOException {
        File folder = new File(uploadFolder);
        if (!folder.exists()) {
            folder.mkdir();
        }

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            String fileName = System.currentTimeMillis() + "-" + image.getOriginalFilename();
            Path path = Paths.get(uploadFolder + fileName);

            if (!Files.exists(path)) {
                Files.write(path, image.getBytes());
                imageUrls.add("/" + uploadFolder + fileName);
            }
        }

        return imageUrls;
    }

    public Optional<Product> findByName(String name) {
        return productRepository.findByName(name);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, String name, String description, Long categoryId, List<Long> featureIds, List<String> imageUrls) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        // Validación: Si el nombre cambió, verificar duplicados
        if (!product.getName().equalsIgnoreCase(name)) {
            Optional<Product> existingProduct = productRepository.findByName(name);
            if (existingProduct.isPresent()) {
                throw new RuntimeException("El nombre del producto ya está en uso");
            }
        }

        product.setName(name);
        product.setDescription(description);

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoryId));
            product.setCategory(category);
        }

        if (imageUrls != null && !imageUrls.isEmpty()) {
            product.setImageUrls(imageUrls);
        }

        if (featureIds != null) {
            Set<Feature> features = new HashSet<>(featureRepository.findAllById(featureIds));
            product.setFeatures(features);
        }

        return productRepository.save(product);
    }

}
