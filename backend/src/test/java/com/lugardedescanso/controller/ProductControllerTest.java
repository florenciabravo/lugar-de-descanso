package com.lugardedescanso.controller;

import com.lugardedescanso.entity.Product;
import com.lugardedescanso.repository.ProductRepository;
import com.lugardedescanso.service.ProductService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    //Test 1: Agregar producto con imagen valida
    @Test
    public void testPostAddProduct() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "images",  //nombre del campo
                "test-image.jpg", //nombre del archivo
                "image/jpeg", //tipo MIME
                "contenido de prueba".getBytes() //contenido del archivo
        );

        String randomName = "TestCabana-" + UUID.randomUUID();

        mockMvc.perform(multipart("/products")
                        .file(image)
                        .param("name", randomName)
                        .param("description", "Una hermosa cabana en la sierra")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.product.name").value(randomName))
                .andExpect(jsonPath("$.product.imageUrls").isArray());
    }

    //Test 2: Producto duplicado (nombre ya existente)
    @Test
    public void testPostAddProductDuplicatedName() throws Exception {
        String randomName = "TestCabana-" + UUID.randomUUID();
        // Pre-carga de producto con mismo nombre (simula que ya existe)
        productService.addProduct(
                Product.builder()
                        .name(randomName)
                        .description("Existente")
                        .imageUrls(List.of("fake/path.jpg"))
                        .build()
        );

        MockMultipartFile image = new MockMultipartFile(
                "images", "img.jpg", "image/jpeg", "contenido".getBytes()
        );

        mockMvc.perform(multipart("/products")
                        .file(image)
                        .param("name", randomName)  // mismo nombre
                        .param("description", "Otra descripcion")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("El nombre del producto ya está en uso"));
    }

    //Test 3: No se envian imagenes
    @Test
    public void testPostAddProductWithoutImages() throws Exception {
        String randomName = "TestCabana-" + UUID.randomUUID();
        mockMvc.perform(multipart("/products")
                        .param("name", randomName)
                        .param("description", "Descripción sin imágenes")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Se debe proporcionar al menos una imagen"));
    }

    //Test 4: Obtener un producto existente por ID
    @Test
    public void testGetProductById_Success() throws Exception {
        Product product = new Product();
        product.setName("Producto Test");
        product.setDescription("Descripcion test");
        product.setImageUrls(List.of("img1.jpg", "img2.jpg"));
        product = productRepository.save(product);

        mockMvc.perform(get("/products/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId()))
                .andExpect(jsonPath("$.name").value("Producto Test"))
                .andExpect(jsonPath("$.description").value("Descripcion test"))
                .andExpect(jsonPath("$.imageUrls").isArray());
    }

    //Test 5 - Obtener todos los productos
    @Test
    public void testGetAllProducts() throws Exception {
        Product product1 = new Product();
        product1.setName("Producto 1");
        product1.setDescription("Descripcion 1");
        product1.setImageUrls(List.of("img1.jpg"));

        Product product2 = new Product();
        product2.setName("Producto 2");
        product2.setDescription("Descripcion 2");
        product2.setImageUrls(List.of("img2.jpg"));

        productRepository.save(product1);
        productRepository.save(product2);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Producto 1"))
                .andExpect(jsonPath("$[1].name").value("Producto 2"));
    }

    //Test 6: Eliminar producto existente
    @Test
    public void testDeleteProduct_Success() throws Exception {
        // Crear y guardar un producto en la base de datos de test
        Product product = new Product();
        product.setName("Producto para eliminar");
        product.setDescription("Descripción de prueba");
        product.setImageUrls(List.of("test1.jpg", "test2.jpg"));
        product = productRepository.save(product);

        // Realizar la petición DELETE
        mockMvc.perform(delete("/products/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Producto eliminado correctamente"));

        // Verificar que el producto ya no está en la base de datos
        Optional<Product> deletedProduct = productRepository.findById(product.getId());
        assertThat(deletedProduct).isEmpty();
    }
}