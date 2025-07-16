package com.lugardedescanso.controller;

import com.lugardedescanso.dto.ProductWithRatingDTO;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("features") List<Long> featureIds,
            @RequestParam("images") List<MultipartFile> images,
            @RequestParam("locationId") Long locationId) {

        try {
            Product product = productService.createProduct(name, description, categoryId, featureIds, images, locationId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Producto agregado exitosamente");
            response.put("product", product);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al cargar las imágenes: " + e.getMessage()));
        }
    }

    @PostMapping("/upload-images")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        List<String> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            //validar el tipo de archivo
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(List.of("Uno o mas archivos no son imagenes validas"));
            }
            //Validar el tamano (maximo: 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(List.of("Uno o mas archivos superan el limite de 5MB"));
            }
            uploadedFiles.add(file.getOriginalFilename());
        }

        return ResponseEntity.ok(uploadedFiles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Producto eliminado correctamente");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("features") List<Long> featureIds,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam("locationId") Long locationId) {

        try {
            List<String> imageUrls = images != null && !images.isEmpty()
                    ? productService.saveImages(images)
                    : null;

            Product updatedProduct = productService.updateProduct(
                    id, name, description, categoryId, featureIds, imageUrls, locationId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Producto actualizado exitosamente");
            response.put("product", updatedProduct);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al cargar las imágenes: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<ProductWithRatingDTO> getAllProducts() {
        return productService.getAllProductsWithRating();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductWithRatingDTO>> searchProducts(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String checkIn,
            @RequestParam(required = false) String checkOut) {

        List<ProductWithRatingDTO> results = productService.searchAvailableProductsWithRating(city, checkIn, checkOut);
        return ResponseEntity.ok(results);
    }

}
