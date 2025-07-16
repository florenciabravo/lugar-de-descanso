package com.lugardedescanso.repository;

import com.lugardedescanso.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
}
