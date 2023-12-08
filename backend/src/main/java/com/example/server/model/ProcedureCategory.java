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
public class ProcedureCategory {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;
    private String name;
    private String description;
}
