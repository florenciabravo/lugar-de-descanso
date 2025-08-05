package com.lugardedescanso.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDTO {
    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long productId;
    private String phone;
    private String comment;
    private LocalDateTime createdAt;
}
