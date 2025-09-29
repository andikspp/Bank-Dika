package com.bms.dto.accountManagement;

import java.math.BigDecimal;

/**
 * Data Transfer Object for creating a withdrawal account.
 * Includes account number and withdrawal amount as a string.
 * Provides constructors, getters, setters, and a toString method.
 */
public class CreateWithdrawalAccountDTO {
    private String accountNumber;
    private String amount;

    public CreateWithdrawalAccountDTO() {
    }

    public CreateWithdrawalAccountDTO(String accountNumber, String amount) {
        this.accountNumber = accountNumber;
        this.amount = amount;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "CreateWithdrawalAccountDTO{" +
                "accountNumber='" + accountNumber + '\'' +
                ", amount='" + amount + '\'' +
                '}';
    }
}