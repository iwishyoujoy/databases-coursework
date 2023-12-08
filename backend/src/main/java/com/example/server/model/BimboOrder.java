package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "bimbo_order")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BimboOrder {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    private Long customer_id;
    private Timestamp timestamp;
    private String status;

}
