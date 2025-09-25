package com.bms.service;

import com.bms.model.User;
import com.bms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service untuk autentikasi dan manajemen user.
 * Operasi:
 * - Autentikasi user dengan username dan password.
 * - Mencari user berdasarkan username.
 * - Menyimpan user baru atau memperbarui user yang ada.
 * Menggunakan repository UserRepository untuk operasi database.
 * Menggunakan BCrypt untuk hashing password.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Authenticate user
     * 
     * @param username
     * @param password
     * @return
     */
    public User authenticate(String username, String password) {
        try {
            User user = userRepository.findByUsername(username);
            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                return user;
            } else {
                throw new IllegalArgumentException("Invalid username or password");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error during authentication: " + e.getMessage());
        }
    }

    /**
     * Find user by username
     * 
     * @param username
     * @return
     */
    public User findByUsername(String username) {
        try {
            return userRepository.findByUsername(username);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user by username: " + e.getMessage());
        }
    }

    /**
     * Save or update user
     * 
     * @param user
     */
    public void saveUser(User user) {
        try {
            // Hash password sebelum menyimpan
            if (user.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error saving user: " + e.getMessage());
        }
    }

    /**
     * Register User
     * 
     * @param user
     * @return
     */
    public User registerUser(User user) {
        try {
            if (userRepository.findByUsername(user.getUsername()) != null) {
                throw new IllegalArgumentException("Username already exists");
            }
            // Hash password sebelum menyimpan
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error registering user: " + e.getMessage());
        }
    }
}