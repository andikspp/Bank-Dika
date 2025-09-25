package com.bms.controller;

import com.bms.model.User;
import com.bms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.bms.service.AuthService;
import com.bms.service.RoleService;
import com.bms.security.JwtUtil;

import java.util.Map;

/**
 * Controller untuk autentikasi dan registrasi user.
 * Endpoints:
 * - POST /api/auth/login : Untuk login user.
 * - POST /api/auth/register : Untuk registrasi user baru.
 * Menggunakan JWT untuk otentikasi.
 * Menggunakan BCrypt untuk hashing password.
 * Menggunakan service AuthService dan RoleService untuk operasi terkait user
 * dan role.
 * Mengembalikan response dalam format JSON.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private RoleService roleService;

    /**
     * Login user
     * 
     * @param loginRequest
     * @return
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // Validasi input
            if (username == null || username.isBlank() || password == null || password.isBlank()) {
                return Map.of(
                        "success", false,
                        "message", "Semua field harus diisi");
            }

            User user = authService.findByUsername(username);
            if (user == null) {
                return Map.of(
                        "success", false,
                        "message", "Username tidak ditemukan");
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            if (!encoder.matches(password, user.getPassword())) {
                return Map.of(
                        "success", false,
                        "message", "Password salah");
            }

            /* GenerateToken(String, String) */
            String token = JwtUtil.generateToken(username, user.getRole().getName());

            return Map.of(
                    "success", true,
                    "message", "Login berhasil",
                    "token", token,
                    "role", user.getRole().getName());
        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "message", "Terjadi kesalahan saat proses login");
        }
    }

    /**
     * Register user baru
     * 
     * @param registerRequest
     * @return
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> registerRequest) {
        try {
            String username = registerRequest.get("username");
            String password = registerRequest.get("password");
            String roleName = registerRequest.get("role");

            // Validasi input
            if (username == null || username.isBlank() || password == null || password.isBlank()
                    || roleName == null || roleName.isBlank()) {
                return Map.of(
                        "success", false,
                        "message", "Semua field harus diisi");
            }

            if (authService.findByUsername(username) != null) {
                return Map.of(
                        "success", false,
                        "message", "Username sudah terdaftar");
            }

            if (!roleService.isValidRole(roleName)) {
                return Map.of(
                        "success", false,
                        "message", "Role tidak valid");
            }

            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(password);
            newUser.setRole(roleService.findByName(roleName));
            authService.saveUser(newUser);

            return Map.of(
                    "success", true,
                    "message", "Registrasi berhasil");
        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "message", "Terjadi kesalahan saat proses registrasi");
        }
    }
}