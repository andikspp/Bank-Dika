package com.bms.dto.userManagement;

import java.time.LocalDateTime;
import java.util.List;
import com.bms.dto.accountManagement.AccountResponseDTO;

/**
 * Data Transfer Object untuk mendapatkan informasi nasabah berdasarkan ID user.
 * Berisi informasi nasabah beserta daftar rekening yang dimiliki.
 * Untuk keperluan halaman Detail Customer
 * Fields:
 * - id: ID nasabah.
 * - username: Nama pengguna.
 * - roleName: Nama peran pengguna.
 * - fullName: Nama lengkap nasabah.
 * - email: Email nasabah.
 * - phone: Nomor telepon nasabah.
 * - address: Alamat nasabah.
 * - ktpNumber: Nomor KTP nasabah.
 * - registrationDate: Tanggal pendaftaran nasabah.
 * - accounts: Daftar rekening yang dimiliki nasabah.
 */
public class GetCustomerByUserIdDTO {
    private Long id;
    private String username;
    private String roleName;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String ktpNumber;
    private LocalDateTime registrationDate;
    private List<AccountResponseDTO> accounts;

    /**
     * Constructor untuk GetCustomerByUserIdDTO.
     * 
     * @param id
     * @param username
     * @param roleName
     * @param fullName
     * @param email
     * @param phone
     * @param address
     * @param ktpNumber
     * @param registrationDate
     * @param accounts
     */
    public GetCustomerByUserIdDTO(Long id, String username, String roleName, String fullName, String email,
            String phone, String address, String ktpNumber, LocalDateTime registrationDate,
            List<AccountResponseDTO> accounts) {
        this.id = id;
        this.username = username;
        this.roleName = roleName;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.ktpNumber = ktpNumber;
        this.registrationDate = registrationDate;
        this.accounts = accounts;
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
