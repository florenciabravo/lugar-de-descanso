package com.lugardedescanso.service;

import com.lugardedescanso.entity.Reservation;
import com.lugardedescanso.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public List<LocalDate> getBookedDatesForProduct(Long productId) {
        List<Reservation> reservations = reservationRepository.findByProductId(productId);

        List<LocalDate> bookedDates = new ArrayList<>();
        for (Reservation r : reservations) {
            LocalDate date = r.getCheckInDate();
            while (!date.isAfter(r.getCheckOutDate().minusDays(1))) {
                bookedDates.add(date);
                date = date.plusDays(1);
            }
        }

        return bookedDates;
    }

    public List<Reservation> getReservationsByUserId(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

}
