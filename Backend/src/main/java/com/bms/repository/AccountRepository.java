package com.bms.repository;

import com.bms.model.Account;
import com.bms.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository untuk entitas Account.
 * Menyediakan metode untuk operasi CRUD dan pencarian khusus pada akun.
 * Extends JpaRepository untuk mendapatkan fungsionalitas dasar dari Spring Data
 * JPA.
 * 
 * @see JpaRepository
 * @see Account
 * @see Customer
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByCustomer(Customer customer);

    List<Account> findByAccountNumberContainingIgnoreCase(String accountNumber);

    List<Account> findByAccountTypeIgnoreCase(String accountType);

    List<Account> findByStatusIgnoreCase(String status);

    boolean existsByAccountNumber(String accountNumber);
}