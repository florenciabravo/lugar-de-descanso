package com.lugardedescanso.controller;

import com.lugardedescanso.entity.Product;
import com.lugardedescanso.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    private ProductService productService;
    private String uploadFolder = "uploads/";

    public ProductController(ProductService productService) {
        this.productService = productService;
        File folder = new File(uploadFolder);
        if (!folder.exists()) {
            folder.mkdir();
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam(required = false)List<MultipartFile> images) {

        try {
            //Validar que al menos una imagen sea proporcionada
            if (images == null || images.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error","Se debe proporcionar al menos una imagen"));
            }

            //Verificar que cada archivo sea una imagen valida
            for (MultipartFile image : images) {
                if (!image.getContentType().startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error","Solo se pueden cargar archivos de imagen"));
                }
            }

            // Validar si el producto ya existe antes de guardar imagenes
            Optional<Product> existingProduct = productService.findByName(name);
            if (existingProduct.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "El nombre del producto ya está en uso"));
            }

            //Guardar las imagenes
            List<String> imageUrls = saveImages(images);

            // Crear el producto
            Product product = Product.builder()
                    .name(name)
                    .description(description)
                    .imageUrls(imageUrls)
                    .build();

            productService.addProduct(product);
            // Devolver JSON con mensaje de exito con el producto creado
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Producto agregado exitosamente");
            response.put("product", product);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al cargar las imagenes" + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error","Error: " + e.getMessage()));
        }
    }

    private List<String> saveImages(List<MultipartFile> images) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            //Guarda cada imagen en el directorio
            String fileName = System.currentTimeMillis() + "-" + image.getOriginalFilename();
            Path path = Paths.get(uploadFolder + fileName);

            // Verificar si el archivo ya existe antes de escribirlo
            if (!Files.exists(path)) {
                Files.write(path, image.getBytes());
                System.out.println("Guardando imagen: " + fileName);
                imageUrls.add(path.toString());
            } else {
                System.out.println("Imagen duplicada no guardada: " + fileName);
            }
        }
        return imageUrls;
    }

    @PostMapping("/upload-images")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        List<String> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            //validar el tipo de archivo
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                return  ResponseEntity.badRequest().body(List.of("Uno o mas archivos no son imagenes validas"));
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

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Producto eliminado correctamente");
    }
}
