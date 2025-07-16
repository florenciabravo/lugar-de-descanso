package com.lugardedescanso.repository;

import com.lugardedescanso.entity.Favorite;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    //Optional<Favorite> findByUserAndProduct(User user, Product product);
    Optional<Favorite> findByUserAndProductId(User user, Long productId);
    void deleteByUserAndProduct(User user, Product product);
}
