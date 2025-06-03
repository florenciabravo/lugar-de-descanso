package com.lugardedescanso.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf().disable()
                .authorizeHttpRequests()
                    // Acceso libre a herramientas de desarrollo
                    .requestMatchers("/h2-console/**").permitAll()

                    // Endpoints de autenticacion
                    .requestMatchers("/auth/**").permitAll()

                    // Endpoints públicos
                    .requestMatchers("/products/random").permitAll()
                    .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/features/**").permitAll()
                    .requestMatchers("/uploads/**").permitAll()
                    .requestMatchers("/images/**").permitAll()

                    // Registro y login son públicos
                    .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                    // Rutas de React (frontend)
                    .requestMatchers("/", "/index.html", "/Administracion/**").permitAll()

                    // Endpoints protegidos de productos (solo ADMIN)
                    .requestMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")

                    // Endpoints protegidos de usuarios (solo ADMIN)
                    .requestMatchers(HttpMethod.GET, "/users/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/users/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")

                    // Endpoints protegidos de categories (solo ADMIN)
                    .requestMatchers(HttpMethod.POST, "/categories/**").hasRole("ADMIN")

                    // Endpoints protegidos de features (solo ADMIN)
                    .requestMatchers(HttpMethod.POST, "/features/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/features/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/features/**").hasRole("ADMIN")

                .anyRequest().authenticated()
                .and()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                .headers(headers -> headers.frameOptions().sameOrigin());

        return http.build();
    }
}
