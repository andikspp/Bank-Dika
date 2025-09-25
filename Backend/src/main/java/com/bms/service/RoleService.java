package com.bms.service;

import com.bms.model.Role;
import com.bms.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service untuk manajemen role.
 * Operasi:
 * - Mencari role berdasarkan nama.
 * Menggunakan repository RoleRepository untuk operasi database.
 * Mengembalikan data dalam bentuk entity Role.
 */
@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Find role by name
     * 
     * @param roleName
     * @return
     */
    public Role findByName(String roleName) {
        try {
            return roleRepository.findByName(roleName);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching role by name: " + e.getMessage());
        }
    }

    /**
     * Mengecek apakah role valid
     * 
     * @param roleName
     * @return
     */
    public boolean isValidRole(String roleName) {
        try {
            Role role = roleRepository.findByName(roleName);
            return role != null;
        } catch (Exception e) {
            throw new RuntimeException("Error checking role validity: " + e.getMessage());
        }
    }
}