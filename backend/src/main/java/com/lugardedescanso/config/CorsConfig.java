package com.lugardedescanso.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173") //Permitir solo solicitudes desde URL del frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                        .allowedHeaders("*") // Permitir todas las cabeceras
                        .allowCredentials(true);
            }

            @Override
            //Ruteo para acceder al directorio de imagenes desde la url del servicio
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations("file:./uploads/");

                registry.addResourceHandler("/images/categories/**")
                        .addResourceLocations("file:./uploads/categories/");

                registry.addResourceHandler("/images/features/**")
                        .addResourceLocations("file:./uploads/features/");
            }
        };
    }
}
