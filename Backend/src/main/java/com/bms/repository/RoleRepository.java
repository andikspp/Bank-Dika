package com.bms.repository;

import com.bms.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository untuk entitas Role.
 * Menyediakan metode untuk operasi CRUD pada role.
 * Extends JpaRepository untuk mendapatkan fungsionalitas dasar dari Spring Data
 * JPA.
 * 
 * @see JpaRepository
 * @see Role
 */
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}