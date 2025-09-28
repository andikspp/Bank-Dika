package com.bms.repository;

import com.bms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository untuk entitas User.
 * Menyediakan metode untuk operasi CRUD dan pencarian khusus pada user.
 * Extends JpaRepository untuk mendapatkan fungsionalitas dasar dari Spring Data
 * JPA.
 * 
 * @see JpaRepository
 * @see User
 */
public interface UserRepository extends JpaRepository<User, Long> {
    /*
     * check if username exists
     */
    boolean existsByUsername(String username);

    /*
     * find user by username
     */
    User findByUsername(String username);

    /*
     * find users by role name
     */
    List<User> findByRole_Name(String roleName);

    /*
     * find user by id
     */
    User findById(long id);

    /*
     * delete user by id
     */
    void deleteById(long id);

    /**
     * cek apakah user sudah memiliki customer
     * cek berdasarkan userId
     * 
     * @return true jika user sudah memiliki customer, false jika belum
     */
    boolean existsById(Long id);

    /**
     * find by customer id
     * 
     * @param customerId
     * @return User
     */
    User findByCustomer_Id(Long customerId);
}