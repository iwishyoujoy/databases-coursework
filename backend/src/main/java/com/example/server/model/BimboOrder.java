package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "bimbo_order")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BimboOrder {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "customer_id", nullable = false)
    private Long customer_id;
    @Column(name = "timestamp", nullable = false)
    private Timestamp timestamp;
    @Column(name = "status", nullable = false)
    private String status;

}
