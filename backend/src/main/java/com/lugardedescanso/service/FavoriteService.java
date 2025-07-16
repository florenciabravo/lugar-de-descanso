package com.lugardedescanso.service;

import com.lugardedescanso.dto.FavoriteDTO;
import com.lugardedescanso.entity.Favorite;
import com.lugardedescanso.entity.Product;
import com.lugardedescanso.entity.User;
import com.lugardedescanso.repository.FavoriteRepository;
import com.lugardedescanso.repository.ProductRepository;
import com.lugardedescanso.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<FavoriteDTO> getFavoritesByUser(String email) {
        User user = getUserByEmail(email);
        return favoriteRepository.findByUser(user).stream()
                .map(fav -> new FavoriteDTO(fav.getProduct().getId()))
                .collect(Collectors.toList());
    }

    public void toggleFavorite(String email, Long productId) {
        User user = getUserByEmail(email);
        Product product = getProductById(productId);

        favoriteRepository.findByUserAndProductId(user, productId)
                .ifPresentOrElse(
                        favoriteRepository::delete,
                        () -> favoriteRepository.save(Favorite.builder()
                                .user(user)
                                .product(product)
                                .build())
                );
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    private Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: ID " + productId));
    }

    public void removeFavorite(Long productId, String email) {
        User user = getUserByEmail(email);

        Favorite favorite = favoriteRepository.findByUserAndProductId(user, productId)
                .orElseThrow(() -> new RuntimeException("No se encontró el favorito del producto con ID " +
                        productId + " para el usuario " + email));

        favoriteRepository.delete(favorite);
    }

}
