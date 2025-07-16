package com.lugardedescanso.controller;

import com.lugardedescanso.dto.ReservationDTO;
import com.lugardedescanso.entity.Reservation;
import com.lugardedescanso.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
