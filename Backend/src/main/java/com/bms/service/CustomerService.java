package com.bms.service;

import com.bms.model.Customer;
import com.bms.model.User;
import com.bms.dto.customerManagement.GetCustomerDTO;
import com.bms.dto.customerManagement.CreateCustomerDTO;
import com.bms.dto.customerManagement.UpdateCustomerDTO;
import com.bms.repository.CustomerRepository;
import com.bms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service untuk manajemen customer.
 * Operasi:
 * - Mendapatkan semua customer.
 * - Membuat customer baru dan mengaitkannya dengan user.
 * Menggunakan repository CustomerRepository dan UserRepository untuk operasi
 * database.
 * Mengembalikan data dalam bentuk DTO (Data Transfer Object).
 */
@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Constructor untuk CustomerService
     * 
     * @param customerRepository
     */
    public CustomerService(CustomerRepository customerRepository) {
        try {
            this.customerRepository = customerRepository;
        } catch (Exception e) {
            throw new RuntimeException("Error initializing CustomerService: " + e.getMessage());
        }
    }

    /**
     * Get all customers
     * 
     * @param customer
     * @param userId
     * @return
     */
    public List<GetCustomerDTO> getAllCustomers() {
        try {
            List<Customer> customers = customerRepository.findAll();
            return customers.stream()
                    .map(customer -> new GetCustomerDTO(
                            customer.getId(),
                            customer.getFullName(),
                            customer.getEmail(),
                            customer.getPhone(),
                            customer.getAddress(),
                            customer.getKtpNumber(),
                            customer.getRegistrationDate()))
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all customers: " + e.getMessage());
        }
    }

    /**
     * Create new customer and link to user
     * pakai dto CreateCustomerDTO
     * 
     * @param customer
     * @param userId
     * @return
     */
    public Customer createCustomer(Customer customer, Long userId) {
        try {
            System.out.println("CustomerService@Creating customer: " + customer + " for userId: " + userId);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found"));

            if (user.getCustomer() != null) {
                throw new IllegalArgumentException("User with ID " + userId + " already has a customer");
            }

            // Save customer terlebih dahulu agar dapat ID
            Customer savedCustomer = customerRepository.save(customer);

            // Set customer ke user
            user.setCustomer(savedCustomer);

            // Save user agar relasi user-customer tersimpan
            userRepository.save(user);

            System.out.println("CustomerService@Saved customer: " + savedCustomer + " for user: " + user);

            return savedCustomer;
        } catch (Exception e) {
            throw new RuntimeException("Error creating customer: " + e.getMessage());
        }
    }

    /**
     * Update existing customer by Customer ID
     * pakai dto UpdateCustomerDTO
     * 
     * @param id
     * @param req
     * @return
     */
    public Customer updateCustomer(Long id, UpdateCustomerDTO req) {
        try {
            Customer existingCustomer = customerRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Customer with ID " + id + " not found"));

            // Update fields
            existingCustomer.setFullName(req.getFullName());
            existingCustomer.setEmail(req.getEmail());
            existingCustomer.setPhone(req.getPhone());
            existingCustomer.setAddress(req.getAddress());
            existingCustomer.setKtpNumber(req.getKtpNumber());

            // Simpan perubahan
            Customer updatedCustomer = customerRepository.save(existingCustomer);
            return updatedCustomer;
        } catch (Exception e) {
            throw new RuntimeException("Error updating customer: " + e.getMessage());
        }
    }

    /**
     * Delete customer by ID
     * 
     * @param id
     * @return
     */
    public void deleteCustomer(Long id) {
        try {
            Customer existingCustomer = customerRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Customer with ID " + id + " not found"));

            customerRepository.delete(existingCustomer);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting customer: " + e.getMessage());
        }
    }
}