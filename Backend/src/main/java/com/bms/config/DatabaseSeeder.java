package com.bms.config;

import com.bms.model.Role;
import com.bms.model.User;
import com.bms.repository.RoleRepository;
import com.bms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;
import java.util.List;

/**
 * Kelas konfigurasi untuk melakukan seeding data awal ke database.
 * Data yang di-seed meliputi role dan user admin.
 * Data ini hanya akan di-seed jika belum ada di database.
 */
@Configuration
public class DatabaseSeeder {

    /**
     * Melakukan seeding data awal ke database.
     * 
     * @param userRepository
     * @param roleRepository
     * @param passwordEncoder
     * @return
     */
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, RoleRepository roleRepository,
            BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            // Seeder untuk semua role
            List<String> roles = Arrays.asList("ADMIN", "TELLER", "CUSTOMER");
            for (String roleName : roles) {
                if (roleRepository.findByName(roleName) == null) {
                    Role role = new Role();
                    role.setName(roleName);
                    roleRepository.save(role);
                }
            }

            // Pastikan role ADMIN sudah ada
            Role adminRole = roleRepository.findByName("ADMIN");

            // Cek apakah user admin sudah ada
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(adminRole);
                admin.setCreatedAt(java.time.LocalDateTime.now());
                userRepository.save(admin);
            }
        };
    }
}