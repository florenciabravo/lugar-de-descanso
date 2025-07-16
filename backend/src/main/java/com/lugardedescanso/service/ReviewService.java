package com.lugardedescanso.service;

import com.lugardedescanso.dto.ReviewDTO;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.entity.Review;
import com.lugardedescanso.entity.User;
import com.lugardedescanso.repository.ProductRepository;
import com.lugardedescanso.repository.ReviewRepository;
import com.lugardedescanso.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Review saveReview(Long productId, Long userId, int rating, String comment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(rating)
                .comment(comment)
                .createdAt(LocalDateTime.now())
                .build();

        return reviewRepository.save(review);
    }

    public List<ReviewDTO> getReviewsByProductIdDTO(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream().map(r -> {
            ReviewDTO dto = new ReviewDTO();
            dto.setId(r.getId());
            dto.setRating(r.getRating());
            dto.setComment(r.getComment());
            dto.setCreatedAt(r.getCreatedAt());
            dto.setUserFirstname(r.getUser().getFirstname());
            dto.setUserLastname(r.getUser().getLastname());
            return dto;
        }).toList();
    }

    public Double getAverageRatingByProductId(Long productId) {
        return reviewRepository.findAverageRatingByProductId(productId);
    }

}
