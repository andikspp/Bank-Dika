package com.bms.dto.accountManagement;

/**
 * Data Transfer Object untuk memperbarui status akun.
 * Berisi informasi yang diperlukan untuk memperbarui status akun.
 * Fields:
 * - status: Status akun baru ("ACTIVE", "INACTIVE").
 */
public class UpdateAccountStatusDTO {
    private String status;

    public UpdateAccountStatusDTO(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}