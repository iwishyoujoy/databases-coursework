package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Date;


@Entity
@Table(name = "customer")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    private String name;
    private String surname;
    private Date birthday;
    private String phone_number;
    private String login;
    private String password;
}
