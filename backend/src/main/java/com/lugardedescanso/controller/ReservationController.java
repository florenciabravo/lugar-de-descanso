package com.lugardedescanso.controller;

import com.lugardedescanso.dto.ReservationDTO;
import com.lugardedescanso.dto.ReservationHistoryDTO;
import com.lugardedescanso.dto.ReservationRequestDTO;
import com.lugardedescanso.entity.Reservation;
import com.lugardedescanso.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/booked-dates/{productId}")
    public ResponseEntity<List<LocalDate>> getBookedDates(@PathVariable Long productId) {
        try {
            List<LocalDate> bookedDates = reservationService.getBookedDatesForProduct(productId);
            return ResponseEntity.ok(bookedDates);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByUser(@PathVariable Long userId) {
        try {
            List<Reservation> reservations = reservationService.getReservationsByUserId(userId);
            List<ReservationDTO> dtos = reservations.stream()
                    .map(r -> ReservationDTO.builder()
                            .id(r.getId())
                            .checkInDate(r.getCheckInDate())
                            .checkOutDate(r.getCheckOutDate())
                            .productId(r.getProduct().getId())
                            .build())
                    .toList();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequestDTO dto) {
        try {
            Reservation reservation = reservationService.createReservation(dto);
            ReservationDTO response = ReservationDTO.builder()
                    .id(reservation.getId())
                    .checkInDate(reservation.getCheckInDate())
                    .checkOutDate(reservation.getCheckOutDate())
                    .productId(reservation.getProduct().getId())
                    .phone(reservation.getPhone())
                    .comment(reservation.getComment())
                    .createdAt(reservation.getCreatedAt())
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la reserva. Intente más tarde.");
        }
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationHistoryDTO>> getMyReservations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        List<Reservation> reservations = reservationService.getReservationsByUserEmail(email);

        List<ReservationHistoryDTO> dtos = reservations.stream()
                .sorted((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt()))
                .map(r -> {
                    String imageUrl = null;
                    List<String> images = r.getProduct().getImageUrls();
                    if (images != null && !images.isEmpty()) {
                        imageUrl = images.get(0); // primera imagen
                    }

                    return ReservationHistoryDTO.builder()
                            .id(r.getId())
                            .productName(r.getProduct().getName())
                            .productImageUrl(imageUrl)
                            .checkInDate(r.getCheckInDate())
                            .checkOutDate(r.getCheckOutDate())
                            .createdAt(r.getCreatedAt())
                            .build();
                })
                .toList();

        return ResponseEntity.ok(dtos);
    }
}
