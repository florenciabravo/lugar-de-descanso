package com.lugardedescanso.controller;

import com.lugardedescanso.entity.Category;
import com.lugardedescanso.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Category> addCategory(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("image")MultipartFile imageFile
    ) throws IOException {
        Category category = categoryService.addCategory(title, description, imageFile);
        return ResponseEntity.ok(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }
}
