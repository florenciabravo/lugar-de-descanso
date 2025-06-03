package com.lugardedescanso.service;

import com.lugardedescanso.entity.Category;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CategoryService {
    Category addCategory(String title, String description, MultipartFile imageFile) throws IOException;

    List<Category> getAllCategories();
}
