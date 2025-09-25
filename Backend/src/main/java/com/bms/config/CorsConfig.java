package com.bms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Konfigurasi untuk CORS (Cross-Origin Resource Sharing).
 * Mengizinkan permintaan dari domain tertentu untuk mengakses API.
 * Domain yang diizinkan dikonfigurasi melalui properti aplikasi.
 */
@Configuration
public class CorsConfig {

    /**
     * Daftar domain yang diizinkan untuk mengakses API.
     * Nilai ini diambil dari properti aplikasi (application.properties atau
     * application.yml).
     */
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    /**
     * Mengatur konfigurasi CORS untuk aplikasi.
     * 
     * @return
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}