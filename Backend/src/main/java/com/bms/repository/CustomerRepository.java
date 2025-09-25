// Contoh untuk Customer
package com.bms.repository;

import com.bms.model.Customer;
import com.bms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository untuk entitas Customer.
 * Menyediakan metode untuk operasi CRUD pada customer.
 * Extends JpaRepository untuk mendapatkan fungsionalitas dasar dari Spring Data
 * JPA.
 * 
 * @see JpaRepository
 * @see Customer
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findById(long id);
}