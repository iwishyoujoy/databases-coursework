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
    private String photo_url;
    private String name;
    private Float price;
    private Long procedure_category_id;
    private Long clinic_id;
}
