package com.lugardedescanso.controller;

import com.lugardedescanso.dto.FavoriteDTO;
import com.lugardedescanso.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<FavoriteDTO>> getFavorites(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(favoriteService.getFavoritesByUser(email));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> toggleFavorite(@PathVariable Long productId, Authentication authentication) {
        String email = authentication.getName();
        favoriteService.toggleFavorite(email, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long productId, Authentication authentication) {
        String email = authentication.getName();
        favoriteService.removeFavorite(productId, email);
        return ResponseEntity.noContent().build();
    }

}
