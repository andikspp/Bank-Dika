package com.bms.dto.customerManagement;

import java.util.List;
import java.time.LocalDateTime;
import com.bms.dto.accountManagement.AccountResponseDTO;

/**
 * Data Transfer Object untuk mendapatkan detail customer sekaligus mendapatkan
 * rekening terkait.
 * Digunakan untuk mentransfer data dari server ke client saat mengambil detail
 * customer.
 * fields:
 * - id: ID unik customer.
 * - fullName: Nama lengkap customer.
 * - email: Alamat email customer.
 * - phone: Nomor telepon customer.
 * - address: Alamat customer.
 * - ktpNumber: Nomor KTP customer.
 * - registrationDate: Tanggal dan waktu pendaftaran customer.
 * - accounts: Daftar rekening yang dimiliki customer.
 * 
 * @see GetCustomerDTO
 * @see AccountResponseDTO
 */
public class GetCustomerDetailDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String ktpNumber;
    private LocalDateTime registrationDate;
    private List<AccountResponseDTO> accounts;

    public GetCustomerDetailDTO(Long id, String fullName, String email, String phone, String address, String ktpNumber,
            LocalDateTime registrationDate, List<AccountResponseDTO> accounts) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.ktpNumber = ktpNumber;
        this.registrationDate = registrationDate;
        this.accounts = accounts;
    }

    // getter & setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getKtpNumber() {
        return ktpNumber;
    }

    public void setKtpNumber(String ktpNumber) {
        this.ktpNumber = ktpNumber;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public List<AccountResponseDTO> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<AccountResponseDTO> accounts) {
        this.accounts = accounts;
    }
}