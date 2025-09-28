package com.bms.dto.accountManagement;

import java.math.BigDecimal;

/**
 * Data Transfer Object for creating a deposit account.
 * Includes account number and initial deposit amount.
 * Provides constructors, getters, setters, and a toString method.
 */
public class CreateDepositAccountDTO {
    private String accountNumber;
    private BigDecimal amount;

    public CreateDepositAccountDTO() {
    }

    public CreateDepositAccountDTO(String accountNumber, BigDecimal amount) {
        this.accountNumber = accountNumber;
        this.amount = amount;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "CreateDepositAccountDTO{" +
                "accountNumber='" + accountNumber + '\'' +
                ", amount=" + amount +
                '}';
    }
}