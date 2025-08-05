package com.lugardedescanso.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequestDTO {
    private Long productId;
    private Long userId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String phone;
    private String comment;
}
