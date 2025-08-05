package com.lugardedescanso.repository;

import com.lugardedescanso.entity.Product;
import com.lugardedescanso.entity.Reservation;
import com.lugardedescanso.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.product.id = :productId")
    List<Reservation> findByProductId(@Param("productId") Long productId);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId")
    List<Reservation> findByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Reservation r WHERE r.product = :product AND " +
            "r.checkOutDate > :checkIn AND r.checkInDate < :checkOut")
    List<Reservation> findOverlappingReservations(
            @Param("product") Product product,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );
}
