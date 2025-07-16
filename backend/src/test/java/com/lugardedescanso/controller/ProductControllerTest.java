package com.lugardedescanso.controller;

import com.lugardedescanso.entity.Category;
import com.lugardedescanso.entity.Feature;
import com.lugardedescanso.entity.Location;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.repository.CategoryRepository;
import com.lugardedescanso.repository.FeatureRepository;
import com.lugardedescanso.repository.LocationRepository;
import com.lugardedescanso.repository.ProductRepository;
import com.lugardedescanso.service.ProductService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.hamcrest.Matchers.containsInAnyOrder;
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

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FeatureRepository featureRepository;

    @Autowired
    private LocationRepository locationRepository;

    private Category createTestCategory() {
        Category category = new Category();
        category.setTitle("Categoria Test1");
        category.setDescription("Descripcion test1");
        category.setImageUrl("test1-category.jpg");
        return categoryRepository.save(category);
    }

    private Location createTestLocation() {
        Location location = new Location();
        location.setCity("Ciudad Test");
        location.setState("Estado Test");
        location.setCountry("País Test");
        return locationRepository.save(location);
    }

    //Test 1: Agregar producto con imagen valida
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testPostAddProduct() throws Exception {
        Category category = createTestCategory();

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
                        .param("categoryId", category.getId().toString())
                        .param("features", "1")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.product.name").value(randomName))
                .andExpect(jsonPath("$.product.imageUrls").isArray());
    }

    //Test 2: Producto duplicado (nombre ya existente)
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testPostAddProductDuplicatedName() throws Exception {
        Category category = createTestCategory();
        String randomName = "TestCabana-" + UUID.randomUUID();

        // Pre-carga de producto con mismo nombre (simula que ya existe)
        MockMultipartFile dummyImage = new MockMultipartFile(
                "images",
                "dummy.jpg",
                "image/jpeg",
                "contenido".getBytes()
        );

        productService.createProduct(
                randomName,
                "Producto Existente",
                category.getId(),
                List.<Long>of(),
                List.of(dummyImage),
                createTestLocation().getId()
        );

        MockMultipartFile newImage = new MockMultipartFile(
                "images",
                "test-image.jpg",
                "image/jpeg",
                "contenido nuevo".getBytes()
        );

        mockMvc.perform(multipart("/products")
                        .file(newImage)
                        .param("name", randomName)  // mismo nombre
                        .param("description", "Otra descripcion")
                        .param("categoryId", category.getId().toString())
                        .param("features", "1")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("El nombre del producto ya está en uso"));
    }

    //Test 3: No se envian imagenes
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testPostAddProductWithoutImages() throws Exception {
        Category category = createTestCategory();

        String randomName = "TestCabana-" + UUID.randomUUID();

        mockMvc.perform(multipart("/products")
                        .file(new MockMultipartFile("images", "", "image/png", new byte[0]))
                        .param("name", randomName)
                        .param("description", "Descripción sin imágenes")
                        .param("categoryId", category.getId().toString())
                        .param("features", "1")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Se debe proporcionar al menos una imagen"));
    }

    //Test 4: Obtener un producto existente por ID
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testGetProductById_Success() throws Exception {
        Category category = createTestCategory();

        // Crear features de prueba
        Feature feature1 = new Feature();
        feature1.setName("Feature 1");
        feature1.setIconUrl("icon1.png");

        Feature feature2 = new Feature();
        feature2.setName("Feature 2");
        feature2.setIconUrl("icon2.png");

        feature1 = featureRepository.save(feature1);
        feature2 = featureRepository.save(feature2);

        Product product = new Product();
        product.setName("Producto Test");
        product.setDescription("Descripcion test");
        product.setImageUrls(List.of("img1.jpg", "img2.jpg"));
        product.setCategory(category);
        product.setFeatures(new HashSet<>(List.of(feature1, feature2)));
        product.setPolicies(new ArrayList<>());
        product.setLocation(createTestLocation());
        product.setReservations(new ArrayList<>());
        product = productRepository.save(product);

        mockMvc.perform(get("/products/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId()))
                .andExpect(jsonPath("$.name").value("Producto Test"))
                .andExpect(jsonPath("$.description").value("Descripcion test"))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.features").isArray())  // Verificar que el arreglo de features está
                .andExpect(jsonPath("$.features[*].name", containsInAnyOrder("Feature 1", "Feature 2")));
    }

    //Test 5 - Obtener todos los productos
    @Test
    public void testGetAllProducts() throws Exception {
        Category category = createTestCategory();

        Feature feature1 = new Feature();
        feature1.setName("Feature 1");
        feature1.setIconUrl("icon1.png");
        feature1 = featureRepository.save(feature1);

        Feature feature2 = new Feature();
        feature2.setName("Feature 2");
        feature2.setIconUrl("icon2.png");
        feature2 = featureRepository.save(feature2);

        Product product1 = new Product();
        product1.setName("Producto 1");
        product1.setDescription("Descripcion 1");
        product1.setImageUrls(List.of("img1.jpg"));
        product1.setCategory(category);
        product1.setFeatures(new HashSet<>(List.of(feature1)));
        product1.setPolicies(new ArrayList<>());
        product1.setLocation(createTestLocation());
        product1.setReservations(new ArrayList<>());

        Product product2 = new Product();
        product2.setName("Producto 2");
        product2.setDescription("Descripcion 2");
        product2.setImageUrls(List.of("img2.jpg"));
        product2.setCategory(category);
        product2.setFeatures(new HashSet<>(List.of(feature2)));
        product2.setPolicies(new ArrayList<>());
        product2.setLocation(createTestLocation());
        product2.setReservations(new ArrayList<>());

        productRepository.save(product1);
        productRepository.save(product2);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[*].features").isArray())
                .andExpect(jsonPath("$[0].name").value("Producto 1"))
                .andExpect(jsonPath("$[1].name").value("Producto 2"));
    }

    //Test 6: Eliminar producto existente
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void testDeleteProduct_Success() throws Exception {
        Category category = createTestCategory();

        Feature feature = new Feature();
        feature.setName("Feature para eliminar");
        feature.setIconUrl("icon-delete.png");
        feature = featureRepository.save(feature);

        // Crear y guardar un producto en la base de datos de test
        Product product = new Product();
        product.setName("Producto para eliminar");
        product.setDescription("Descripción de prueba");
        product.setImageUrls(List.of("test1.jpg", "test2.jpg"));
        product.setCategory(category);
        product.setFeatures(Set.of(feature));
        product.setPolicies(new ArrayList<>());
        product.setLocation(createTestLocation());
        product.setReservations(new ArrayList<>());

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