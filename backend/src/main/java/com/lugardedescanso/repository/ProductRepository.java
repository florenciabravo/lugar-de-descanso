package com.lugardedescanso.repository;

import com.lugardedescanso.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByName(String name);

    List<Product> findByLocation_CityIgnoreCase(String city);

    @Query("""
                SELECT DISTINCT p FROM Product p 
                LEFT JOIN p.reservations r 
                WHERE (:city IS NULL OR LOWER(p.location.city) = LOWER(:city))
                AND (
                    (:checkIn IS NULL OR :checkOut IS NULL)
                    OR r IS NULL
                    OR (r.checkOutDate <= :checkIn OR r.checkInDate >= :checkOut)
                )
            """)
    List<Product> findAvailableProducts(
            @Param("city") String city,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    boolean existsByCategoryId(Long categoryId);

}
