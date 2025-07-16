package com.lugardedescanso.repository;

import com.lugardedescanso.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.product.id = :productId")
    List<Reservation> findByProductId(@Param("productId") Long productId);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId")
    List<Reservation> findByUserId(@Param("userId") Long userId);

}
