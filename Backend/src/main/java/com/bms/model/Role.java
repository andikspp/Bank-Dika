package com.bms.model;

import jakarta.persistence.*;
import java.util.List;

/**
 * Entitas Role merepresentasikan peran pengguna dalam sistem.
 * Menyimpan informasi seperti nama peran dan daftar pengguna yang memiliki
 * peran tersebut.
 * Terhubung dengan entitas User melalui relasi One-to-Many.
 */
@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String name;

    @OneToMany(mappedBy = "role")
    private List<User> users;

    // getter & setter
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}