package com.example.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "procedure")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Procedure {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "photo_url", nullable = false)
    private String photo_url;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "price", nullable = false)
    private Float price;
    @Column(name = "procedure_category_id", nullable = false)
    private Long procedure_category_id;
    @Column(name = "clinic_id", nullable = false)
    private Long clinic_id;
}
