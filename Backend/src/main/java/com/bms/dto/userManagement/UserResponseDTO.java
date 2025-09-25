package com.bms.dto.userManagement;

/**
 * Data Transfer Object untuk respons user ke sisi klien.
 * Berisi informasi dasar user.
 * Fields:
 * - id: ID user.
 * - username: Nama pengguna.
 * - roleName: Nama peran pengguna.
 */
public class UserResponseDTO {
    private Long id;
    private String username;
    private String roleName;

    /**
     * Constructor untuk UserResponseDTO.
     * 
     * @param id
     * @param username
     * @param roleName
     */
    public UserResponseDTO(Long id, String username, String roleName) {
        this.id = id;
        this.username = username;
        this.roleName = roleName;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}