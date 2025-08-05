package com.lugardedescanso.controller;

import com.lugardedescanso.dto.UpdateRoleRequest;
import com.lugardedescanso.dto.UserResponseDTO;
import com.lugardedescanso.entity.User;
import com.lugardedescanso.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<Map<String, String>> updateUserRole(
            @PathVariable Long id,
            @RequestBody UpdateRoleRequest request
    ) {
        userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok(Map.of("message", "Rol actualizado correctamente"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getLoggedUser(@AuthenticationPrincipal User user) {
        UserResponseDTO dto = userService.mapUserToDto(user);
        return ResponseEntity.ok(dto);
    }

}
