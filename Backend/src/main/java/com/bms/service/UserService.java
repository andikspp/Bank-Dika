package com.bms.service;

import com.bms.dto.userManagement.UserResponseDTO;
import com.bms.dto.userManagement.UserRequestDTO;
import com.bms.dto.userManagement.GetUserByIdDTO;
import com.bms.dto.accountManagement.AccountResponseDTO;
import com.bms.dto.userManagement.GetCustomerByUserIdDTO;
import com.bms.model.User;
import com.bms.model.Role;
import com.bms.model.Customer;
import com.bms.repository.UserRepository;
import com.bms.repository.RoleRepository;
import com.bms.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service untuk manajemen user.
 * Operasi:
 * - Mendapatkan semua user.
 * - Mendapatkan user berdasarkan ID.
 * - Mendapatkan detail customer berdasarkan user ID.
 * - Mendapatkan user dengan role CUSTOMER dan TELLER.
 * - Membuat user baru.
 * - Memperbarui user yang ada.
 * - Menghapus user.
 * Menggunakan repository UserRepository, RoleRepository, dan CustomerRepository
 * untuk operasi database.
 * Mengembalikan data dalam bentuk DTO (Data Transfer Object) atau entity User.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Get users by role
     * 
     * @param role
     * @return
     */
    public List<User> getUsersByRole(String role) {
        try {
            return userRepository.findByRole_Name(role);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching users by role: " + e.getMessage());
        }
    }

    /**
     * Get all users
     * 
     * @return
     */
    public List<User> getAllUsers() {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all users: " + e.getMessage());
        }
    }

    /**
     * Get user by ID
     * 
     * @param id
     * @return
     */
    public GetUserByIdDTO getUserById(Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
            return new GetUserByIdDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().getName());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user by ID: " + e.getMessage());
        }
    }

    /**
     * Get customer details by user ID
     * 
     * @param id
     * @return
     */
    public GetCustomerByUserIdDTO getCustomerDetails(Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

            if (!user.getRole().getName().equals("CUSTOMER")) {
                throw new IllegalArgumentException("Pengguna bukan customer.");
            }

            Customer customer = user.getCustomer();

            List<AccountResponseDTO> accounts = customer != null && customer.getAccounts() != null
                    ? customer.getAccounts().stream()
                            .map(account -> new AccountResponseDTO(
                                    account.getId(),
                                    account.getAccountNumber(),
                                    account.getAccountType(),
                                    account.getBalance(),
                                    account.getStatus(),
                                    account.getCustomer().getFullName(),
                                    account.getOpenedAt(),
                                    account.getCustomer().getId()))
                            .collect(Collectors.toList())
                    : List.of();

            return new GetCustomerByUserIdDTO(
                    customer != null ? customer.getId() : null,
                    user.getUsername(),
                    user.getRole().getName(),
                    customer != null ? customer.getFullName() : null,
                    customer != null ? customer.getEmail() : null,
                    customer != null ? customer.getPhone() : null,
                    customer != null ? customer.getAddress() : null,
                    customer != null ? customer.getKtpNumber() : null,
                    customer != null ? customer.getRegistrationDate() : null,
                    accounts);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Get users with role CUSTOMER and TELLER
     * 
     * @return
     */
    public List<UserResponseDTO> getCustomersAndTellers() {
        try {
            List<User> users = userRepository.findByRole_Name("CUSTOMER");
            users.addAll(userRepository.findByRole_Name("TELLER"));
            return users.stream()
                    .map(user -> new UserResponseDTO(
                            user.getId(),
                            user.getUsername(),
                            user.getRole().getName()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching customers and tellers: " + e.getMessage());
        }
    }

    /**
     * Create new user
     * 
     * @param dto
     * @return
     */
    public User createUser(UserRequestDTO dto) {
        try {
            // cek apakah username sudah ada
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new IllegalArgumentException("Username already exists: " + dto.getUsername());
            }

            // Cari role berdasarkan nama
            Role role = roleRepository.findByName(dto.getRole());
            if (role == null) {
                throw new IllegalArgumentException("Role not found: " + dto.getRole());
            }

            User user = new User();
            user.setUsername(dto.getUsername());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setRole(role);

            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e.getMessage());
        }
    }

    /**
     * Update user by ID
     * 
     * @param id
     * @param dto
     * @return
     */
    public User updateUser(Long id, UserRequestDTO dto) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

            // cek apakah username sudah ada (kecuali untuk user yang sedang diupdate)
            if (!user.getUsername().equals(dto.getUsername()) && userRepository.existsByUsername(dto.getUsername())) {
                throw new IllegalArgumentException("Username already exists: " + dto.getUsername());
            }

            // Cari role berdasarkan nama
            Role role = roleRepository.findByName(dto.getRole());
            if (role == null) {
                throw new IllegalArgumentException("Role not found: " + dto.getRole());
            }

            user.setUsername(dto.getUsername());
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            user.setRole(role);

            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error updating user: " + e.getMessage());
        }
    }

    /**
     * Delete user by ID
     * 
     * @param id
     */
    public void deleteUser(Long id) {
        try {
            if (!userRepository.existsById(id)) {
                throw new IllegalArgumentException("User not found with ID: " + id);
            }
            userRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user: " + e.getMessage());
        }
    }
}