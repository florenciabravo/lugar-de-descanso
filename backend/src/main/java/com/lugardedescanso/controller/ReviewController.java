package com.lugardedescanso.controller;

import com.lugardedescanso.dto.ReviewDTO;
import com.lugardedescanso.entity.Review;
import com.lugardedescanso.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(
            @RequestParam Long productId,
            @RequestParam Long userId,
            @RequestParam int rating,
            @RequestParam(required = false) String comment
    ) {
        Review review = reviewService.saveReview(productId, userId, rating, comment);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProductIdDTO(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        Double average = reviewService.getAverageRatingByProductId(productId);
        return ResponseEntity.ok(average != null ? average : 0.0);
    }
}
