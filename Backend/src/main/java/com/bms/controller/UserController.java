package com.bms.controller;

import com.bms.dto.userManagement.UserResponseDTO;
import com.bms.dto.userManagement.UserRequestDTO;
import com.bms.dto.userManagement.GetUserByIdDTO;
import com.bms.dto.userManagement.GetCustomerByUserIdDTO;
import com.bms.model.User;
import com.bms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;
import java.util.Map;

/**
 * Controller untuk manajemen user.
 * Endpoints:
 * - GET /api/users : Untuk mendapatkan semua user.
 * - GET /api/users/{id} : Untuk mendapatkan user berdasarkan ID.
 * - PUT /api/users/{id} : Untuk memperbarui user berdasarkan ID.
 * - POST /api/users/add : Untuk menambahkan user baru (oleh Admin).
 * - DELETE /api/users/{id} : Untuk menghapus user berdasarkan ID.
 * - GET /api/users/customers/{id} : Untuk mendapatkan detail customer
 * berdasarkan user ID.
 * - GET /api/users/customers-tellers : Untuk mendapatkan semua user dengan role
 * CUSTOMER dan TELLER.
 * Menggunakan service UserService untuk operasi terkait user.
 * Mengembalikan response dalam format JSON.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Get all users
     * 
     * @return
     */
    @GetMapping
    public List<User> getAllUsers() {
        try {
            return userService.getAllUsers();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching users", e);
        }
    }

    /**
     * Get user by ID
     * 
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public GetUserByIdDTO getUserById(@PathVariable Long id) {
        try {
            return userService.getUserById(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * Update user by ID
     * 
     * @param id
     * @param userRequestDTO
     * @return
     */
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserRequestDTO userRequestDTO) {
        try {
            return userService.updateUser(id, userRequestDTO);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * Create new user (by Admin)
     * 
     * @param userRequestDTO
     * @return
     */
    @PostMapping("/add")
    public User createUser(@RequestBody UserRequestDTO userRequestDTO) {
        try {
            return userService.createUser(userRequestDTO);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    /**
     * Delete user by ID
     * 
     * @param id
     */
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * Get customer details by user ID
     * 
     * @param id
     * @return
     */
    @GetMapping("/customers/{id}")
    public ResponseEntity<?> getCustomerDetailsById(@PathVariable Long id) {
        try {
            GetCustomerByUserIdDTO dto = userService.getCustomerDetails(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            // Kirim pesan error ke frontend dengan status 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            // Untuk error lain, kirim status 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Internal server error"));
        }
    }

    /**
     * Get all users with role CUSTOMER and TELLER
     * 
     * @return
     */
    @GetMapping("/customers-tellers")
    public List<UserResponseDTO> getCustomersAndTellers() {
        try {
            return userService.getCustomersAndTellers();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching users", e);
        }
    }
}