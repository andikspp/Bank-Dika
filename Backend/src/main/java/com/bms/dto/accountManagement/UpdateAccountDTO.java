package com.bms.dto.accountManagement;

import java.math.BigDecimal;

/**
 * Data Transfer Object untuk memperbarui informasi rekening.
 * Berisi informasi yang dapat diperbarui pada rekening.
 * Fields:
 * - accountType: Jenis rekening ("SAVINGS", "CHECKING").
 * - balance: Saldo rekening.
 * - status: Status rekening ("ACTIVE", "INACTIVE").
 * - Note: customerId tidak termasuk karena tidak dapat diubah setelah pembuatan
 * rekening.
 */
public class UpdateAccountDTO {
    private String accountType;
    private BigDecimal balance;
    private String status;

    /**
     * Constructor untuk UpdateAccountDTO.
     * 
     * @param accountType
     * @param balance
     * @param status
     */
    public UpdateAccountDTO(String accountType, BigDecimal balance, String status) {
        this.accountType = accountType;
        this.balance = balance;
        this.status = status;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}