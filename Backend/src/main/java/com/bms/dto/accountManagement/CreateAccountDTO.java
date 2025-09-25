package com.bms.dto.accountManagement;

import java.math.BigDecimal;

/**
 * Data Transfer Object untuk membuat rekening baru.
 * Berisi informasi yang diperlukan untuk membuat rekening.
 * Fields:
 * - accountType: Jenis rekening ("SAVINGS", "CHECKING").
 * - balance: Saldo awal rekening.
 * - status: Status rekening ("ACTIVE", "INACTIVE").
 * - customerId: ID pelanggan yang memiliki rekening.
 */
public class CreateAccountDTO {
    private String accountType;
    private BigDecimal balance;
    private String status;
    private Long customerId;

    /**
     * Constructor untuk CreateAccountDTO.
     * 
     * @param accountType
     * @param balance
     * @param status
     * @param customerId
     */
    public CreateAccountDTO(String accountType, BigDecimal balance, String status,
            Long customerId) {
        this.accountType = accountType;
        this.balance = balance;
        this.status = status;
        this.customerId = customerId;
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

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}