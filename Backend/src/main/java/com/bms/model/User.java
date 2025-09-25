package com.bms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entitas User merepresentasikan pengguna dalam sistem.
 * Menyimpan informasi seperti username, password, peran, dan
 * terkait dengan entitas Customer jika pengguna adalah nasabah.
 * Terhubung dengan entitas Role melalui relasi Many-to-One.
 * Terhubung dengan entitas Customer melalui relasi One-to-One.
 * Digunakan untuk autentikasi dan otorisasi dalam sistem.
 */
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password; // hashed password

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToOne
    @JoinColumn(name = "customer_id")
    private Customer customer; // nullable, hanya untuk user nasabah

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // getter & setter
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}