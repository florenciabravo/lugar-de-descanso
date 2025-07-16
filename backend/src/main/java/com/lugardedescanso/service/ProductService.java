package com.lugardedescanso.service;

import com.lugardedescanso.dto.ProductWithRatingDTO;
import com.lugardedescanso.repository.ReviewRepository;
import com.lugardedescanso.entity.Category;
import com.lugardedescanso.entity.Feature;
import com.lugardedescanso.entity.Location;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;
    private final LocationRepository locationRepository;
    private final ReviewRepository reviewRepository;
    private final String uploadFolder = "uploads/";

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          FeatureRepository featureRepository,
                          LocationRepository locationRepository,
                          ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
        this.locationRepository = locationRepository;
        this.reviewRepository = reviewRepository;
    }

    public Product createProduct(String name, String description, Long categoryId, List<Long> featureIds,
                                 List<MultipartFile> images, Long locationId) throws IOException {
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

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Ubicación no encontrada con ID: " + locationId));

        Product product = Product.builder()
                .name(name)
                .description(description)
                .imageUrls(imageUrls)
                .category(category)
                .features(features)
                .location(location)
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

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, String name, String description, Long categoryId,
                                 List<Long> featureIds, List<String> imageUrls, Long locationId) {
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

        if (locationId != null) {
            Location location = locationRepository.findById(locationId)
                    .orElseThrow(() -> new RuntimeException("Ubicación no encontrada con ID: " + locationId));
            product.setLocation(location);
        }

        return productRepository.save(product);
    }

    public List<ProductWithRatingDTO> getAllProductsWithRating() {
        List<Product> products = productRepository.findAll();

        return products.stream().map(product -> {
            Double avgRating = reviewRepository.findAverageRatingByProductId(product.getId());
            Long totalReviews = reviewRepository.countByProductId(product.getId());

            return new ProductWithRatingDTO(
                    product.getId(),
                    product.getName(),
                    product.getDescription(),
                    product.getImageUrls(),
                    product.getCategory() != null ? product.getCategory().getTitle() : null,
                    product.getLocation() != null ? product.getLocation().getCity() : null,
                    avgRating != null ? avgRating : 0.0,
                    totalReviews != null ? totalReviews : 0L
            );
        }).collect(Collectors.toList());
    }

    public List<ProductWithRatingDTO> searchAvailableProductsWithRating(String city, String checkInStr, String checkOutStr) {
        LocalDate checkIn = null;
        LocalDate checkOut = null;

        if (checkInStr != null && !checkInStr.isBlank()) {
            checkIn = LocalDate.parse(checkInStr);
        }

        if (checkOutStr != null && !checkOutStr.isBlank()) {
            checkOut = LocalDate.parse(checkOutStr);
        }

        List<Product> availableProducts = productRepository.findAvailableProducts(
                (city != null && !city.trim().isEmpty()) ? city : null,
                checkIn, checkOut
        );

        return availableProducts.stream()
                .map(product -> {
                    Double avgRating = reviewRepository.findAverageRatingByProductId(product.getId());
                    Long totalReviews = reviewRepository.countByProductId(product.getId());

                    return new ProductWithRatingDTO(
                            product.getId(),
                            product.getName(),
                            product.getDescription(),
                            product.getImageUrls(),
                            product.getCategory() != null ? product.getCategory().getTitle() : null,
                            product.getLocation() != null ? product.getLocation().getCity() : null,
                            avgRating != null ? avgRating : 0.0,
                            totalReviews != null ? totalReviews : 0L
                    );
                })
                .collect(Collectors.toList());
    }

}
