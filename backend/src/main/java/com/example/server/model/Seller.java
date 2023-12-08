package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "seller")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Seller {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    private String name;
    private String email;
    private String contact;
    private String login;
    private String password;

}