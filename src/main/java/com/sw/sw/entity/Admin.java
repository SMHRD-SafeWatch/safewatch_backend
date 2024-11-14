package com.sw.sw.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "ADMIN")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Admin {

    @Id
    private String adminId;
    private String password;
}

