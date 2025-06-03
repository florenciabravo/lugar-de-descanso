package com.lugardedescanso.authentication;

import com.lugardedescanso.config.JwtService;
import com.lugardedescanso.entity.Role;
import com.lugardedescanso.entity.User;
import com.lugardedescanso.repository.UserRepository;
import com.lugardedescanso.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El correo electrónico ha sido registrado anteriormente.");
        }

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        //Enviar correo
        String fullName = user.getFirstname() + " " + user.getLastname();
        emailService.sendRegistrationConfirmation(
                user.getEmail(),
                fullName,
                "http://localhost:5173/IniciarSesion"
        );

        var jwt = jwtService.genereToken(user);
        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwt = jwtService.genereToken(user);
        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }
}
