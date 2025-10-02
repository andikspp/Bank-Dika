package com.bms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Konfigurasi keamanan untuk aplikasi.
 * Mengatur enkripsi password dan aturan akses endpoint.
 */
@Configuration
public class SecurityConfig {

    /**
     * Menyediakan bean untuk enkripsi password menggunakan BCrypt.
     * 
     * @return
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Mengatur aturan keamanan HTTP untuk aplikasi.
     * Mengizinkan akses tanpa autentikasi ke endpoint tertentu.
     * 
     * @return
     * @throws Exception
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/users/**", "/api/accounts/**",
                                "/api/customers/**", "/api/transactions/**")
                        .permitAll()
                        .anyRequest().authenticated());
        return http.build();
    }
}