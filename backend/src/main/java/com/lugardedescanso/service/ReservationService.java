package com.lugardedescanso.service;

import com.lugardedescanso.dto.ReservationRequestDTO;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.entity.Reservation;
import com.lugardedescanso.entity.User;
import com.lugardedescanso.repository.ProductRepository;
import com.lugardedescanso.repository.ReservationRepository;
import com.lugardedescanso.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

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

    public Reservation createReservation(ReservationRequestDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + dto.getProductId()));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));

        // Verificar si ya existe una reserva para este producto en el rango seleccionado
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                product, dto.getCheckInDate(), dto.getCheckOutDate()
        );
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("El producto ya está reservado en las fechas seleccionadas.");
        }

        Reservation reservation = Reservation.builder()
                .checkInDate(dto.getCheckInDate())
                .checkOutDate(dto.getCheckOutDate())
                .product(product)
                .user(user)
                .phone(dto.getPhone())
                .comment(dto.getComment())
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        // Enviar correo de confirmación
        String fullName = user.getFirstname() + " " + user.getLastname();
        emailService.sendReservationConfirmation(user.getEmail(), fullName, savedReservation);

        return savedReservation;
    }

    public List<Reservation> getReservationsByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        return reservationRepository.findByUserId(user.getId());
    }

}
