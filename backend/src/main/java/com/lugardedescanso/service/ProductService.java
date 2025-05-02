package com.lugardedescanso.service;

import com.lugardedescanso.entity.Product;
import com.lugardedescanso.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Optional<Product> findByName(String name) {
        return productRepository.findByName(name);
    }

    public Product addProduct(Product product) {
        Optional<Product> existingProduct = productRepository.findByName(product.getName());

        if (existingProduct.isPresent()) {
            throw new RuntimeException("El nombre del producto ya esta en uso");
        }
        return productRepository.save(product);
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

}
