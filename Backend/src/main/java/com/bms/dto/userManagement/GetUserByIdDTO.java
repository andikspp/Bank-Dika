package com.bms.dto.userManagement;

/**
 * Data Transfer Object untuk mendapatkan informasi user berdasarkan ID.
 * Berisi informasi dasar user.
 * Fields:
 * - id: ID user.
 * - username: Nama pengguna.
 * - roleName: Nama peran pengguna.
 */
public class GetUserByIdDTO {
    private Long id;
    private String username;
    private String roleName;

    /**
     * Constructor untuk GetUserByIdDTO.
     * 
     * @param id
     * @param username
     * @param roleName
     */
    public GetUserByIdDTO(Long id, String username, String roleName) {
        this.id = id;
        this.username = username;
        this.roleName = roleName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}