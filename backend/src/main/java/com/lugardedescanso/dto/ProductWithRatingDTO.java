package com.lugardedescanso.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductWithRatingDTO {
    private Long id;
    private String name;
    private String description;
    private List<String> imageUrls;
    private String categoryTitle;
    private String city;
    private Double averageRating;
    private Long totalReviews;
}
