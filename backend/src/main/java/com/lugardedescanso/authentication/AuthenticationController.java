package com.lugardedescanso.authentication;

import com.lugardedescanso.service.EmailService;
import com.lugardedescanso.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register (
            @RequestBody RegisterRequest request) {
            return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login (
            @RequestBody AuthenticationRequest request) {
            return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/resend-confirmation")
    public ResponseEntity<String> resendConfirmation(@RequestParam String email) {
        var user = userService.getUserByEmail(email);
        String fullName = user.getFirstname() + " " + user.getLastname();
        emailService.sendRegistrationConfirmation(email, fullName, "http://localhost:5173/IniciarSesion");
        return ResponseEntity.ok("Correo de confirmación reenviado.");
    }

}
