package com.bms.dto.accountManagement;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object untuk menyampaikan informasi rekening.
 * Digunakan untuk mengirim data rekening dari server ke klien.
 * Berisi informasi dasar tentang rekening seperti nomor rekening, tipe
 * rekening, saldo,
 * status, dan nama pelanggan.
 */
public class AccountResponseDTO {
    private Long id;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private String customerName;
    private LocalDateTime openedDate;
    private long customerId;

    /**
     * Constructor untuk AccountResponseDTO.
     * 
     * @param id
     * @param accountNumber
     * @param accountType
     * @param balance
     * @param status
     * @param customerName
     * @param openedDate
     * @param customerId
     */
    public AccountResponseDTO(Long id, String accountNumber, String accountType, BigDecimal balance, String status,
            String customerName, LocalDateTime openedDate, long customerId) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.status = status;
        this.customerName = customerName;
        this.openedDate = openedDate;
        this.customerId = customerId;
    }

    /**
     * Getter untuk id.
     * 
     * @return
     */
    public Long getId() {
        return id;
    }

    /**
     * Setter untuk id.
     * 
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Getter untuk accountNumber.
     * 
     * @return
     */
    public String getAccountNumber() {
        return accountNumber;
    }

    /**
     * Setter untuk accountNumber.
     * 
     * @param accountNumber
     */
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    /**
     * Getter untuk accountType.
     * 
     * @return
     */
    public String getAccountType() {
        return accountType;
    }

    /**
     * Setter untuk accountType.
     * 
     * @param accountType
     */
    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    /**
     * Getter untuk balance.
     * 
     * @return
     */
    public BigDecimal getBalance() {
        return balance;
    }

    /**
     * Setter untuk balance.
     * 
     * @param balance
     */
    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    /**
     * Getter untuk status.
     * 
     * @return
     */
    public String getStatus() {
        return status;
    }

    /**
     * Setter untuk status.
     * 
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * Getter untuk customerName.
     * 
     * @return
     */
    public String getCustomerName() {
        return customerName;
    }

    /**
     * Setter untuk customerName.
     * 
     * @param customerName
     */
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDateTime getOpenedDate() {
        return openedDate;
    }

    public void setOpenedDate(LocalDateTime openedDate) {
        this.openedDate = openedDate;
    }

    public long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(long customerId) {
        this.customerId = customerId;
    }
}
