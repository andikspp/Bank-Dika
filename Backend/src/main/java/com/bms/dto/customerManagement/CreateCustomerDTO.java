package com.bms.dto.customerManagement;

import com.bms.model.Customer;

/**
 * Data Transfer Object untuk membuat customer baru.
 * Berisi informasi userId dan objek Customer.
 * Digunakan untuk mentransfer data dari client ke server saat membuat customer
 * baru.
 * fields:
 * - userId: ID user yang terkait dengan customer baru.
 * - customer: Objek Customer yang berisi detail customer baru.
 */
public class CreateCustomerDTO {
    private Long userId;
    private Customer customer;

    // getter & setter
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

}
