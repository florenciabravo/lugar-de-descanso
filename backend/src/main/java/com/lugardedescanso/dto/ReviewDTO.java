package com.lugardedescanso.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private String userFirstname;
    private String userLastname;
}
