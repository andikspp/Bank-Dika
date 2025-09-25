package com.bms.dto.userManagement;

/**
 * Data Transfer Object untuk permintaan pembuatan atau pembaruan user.
 * Berisi informasi yang diperlukan untuk membuat atau memperbarui user.
 * Fields:
 * - username: Nama pengguna.
 * - password: Kata sandi pengguna.
 * - role: Peran pengguna ("ADMIN", "CUSTOMER", "TELLER").
 */
public class UserRequestDTO {
    private String username;
    private String password;
    private String role;

    /**
     * Constructor untuk UserRequestDTO.
     * 
     * @param username
     * @param password
     * @param role
     */
    public UserRequestDTO(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}