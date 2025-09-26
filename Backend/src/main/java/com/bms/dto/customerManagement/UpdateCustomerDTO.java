package com.bms.dto.customerManagement;

/**
 * Data Transfer Object untuk memperbarui informasi customer.
 * Berisi informasi userId dan objek Customer yang diperbarui.
 * Digunakan untuk mentransfer data dari client ke server saat memperbarui
 * customer.
 * fields:
 * - fullName
 * - email
 * - phone
 * - address
 * - ktpNumber
 */
public class UpdateCustomerDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String ktpNumber;

    public UpdateCustomerDTO() {
    }

    public UpdateCustomerDTO(Long id, String fullName, String email, String phone, String address, String ktpNumber) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.ktpNumber = ktpNumber;
    }

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

    @Override
    public String toString() {
        return "UpdateCustomerDTO{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", ktpNumber='" + ktpNumber + '\'' +
                '}';
    }
}
